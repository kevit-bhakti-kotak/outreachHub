import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { CampaignsService } from '../../campaigns.service';
import { WorkspaceService, NormalizedWorkspace } from '../../../../core/services/workspace.service';
import { Campaign } from '../../model/campaign.model';
import { ContactService } from '../../../contacts/contact.service';

@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
})
export class CampaignListComponent implements OnInit, OnDestroy {
  campaigns: Campaign[] = [];
  currentWorkspace: NormalizedWorkspace | null = null;
  private sub = new Subscription();
  Math = Math;

  // Audience modal state
  audienceModalOpen = false;
  audienceContacts: any[] = [];

  constructor(
    private campaignService: CampaignsService,
    private workspaceService: WorkspaceService,
    private contactService: ContactService,
    private router: Router
  ) {}

page = 1;
limit = 5;
total = 0;


fetchCampaigns() {
  this.campaignService
    .getCampaigns(this.page, this.limit) // assuming backend supports pagination
    .subscribe((res: any) => {
      this.campaigns = res.data;
      this.total = res.total; // total campaigns from backend
    });
}

onPageChange(next: boolean) {
  if (next) {
    this.page++;
  } else {
    this.page--;
  }
  this.fetchCampaigns();
}


  ngOnInit() {
    this.fetchCampaigns();
    this.sub.add(
      this.workspaceService.selectedWorkspace$.subscribe((ws) => {
        this.currentWorkspace = ws;
        if (ws?.workspaceId) {
          this.loadCampaigns(ws.workspaceId);
        } else {
          this.campaigns = [];
        }
        
      })
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // ---------- Data loading ----------
   loadCampaigns(workspaceId: string) {
    this.campaignService.getAllByWorkspace(workspaceId).subscribe({
      next: (data) => {
        this.campaigns = (data ?? []).map((c) => ({ ...c, audienceCount: 0 }));
        this.campaigns.forEach((c) => this.fetchAudienceCount(c));
      },
      error: (err) => console.error('[CampaignList] Failed to fetch campaigns:', err),
    });
  }

  private fetchAudienceCount(c: Campaign) {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId || !c.selectedTags?.length) {
      c.audienceCount = 0;
      return;
    }
    this.contactService.countByTags(wsId, c.selectedTags).subscribe({
      next: (count) => (c.audienceCount = count),
      error: () => (c.audienceCount = 0),
    });
  }

  // ---------- Audience ----------
  viewAudience(c: Campaign) {
  const wsId = this.workspaceService.getWorkspaceId();
  if (!wsId || !c.selectedTags?.length) return;

  this.contactService.getContactsByTags(wsId, c.selectedTags).subscribe({
    next: (contacts) => {
      this.audienceContacts = contacts;
      this.audienceModalOpen = true; // open modal
    },
    error: (err) => console.error('[CampaignList] Failed to fetch audience:', err),
  });
}

closeAudienceModal() {
  this.audienceModalOpen = false;
  this.audienceContacts = [];
}
  // ---------- CRUD actions ----------
  // inside CampaignListComponent

// modal state
selectedCampaign: Campaign | null = null;
formMode: 'create' | 'edit' | 'view' | null = null;
showForm = false;

// open form modals
openCreate() {
  this.selectedCampaign = null;
  this.formMode = 'create';
  this.showForm = true;
}

openView(c: Campaign) {
  this.selectedCampaign = c;
  this.formMode = 'view';
  this.showForm = true;
}

openEdit(c: Campaign) {
  this.selectedCampaign = c;
  this.formMode = 'edit';
  this.showForm = true;
}


closeForm() {
  this.showForm = false;
  this.selectedCampaign = null;
  this.formMode = null;
}

  deleteCampaign(id: string) {
    if (!confirm('Delete this campaign?')) return;
    this.campaignService.delete(id).subscribe({
      next: () => {
        const wsId = this.workspaceService.getWorkspaceId();
        if (wsId) this.loadCampaigns(wsId);
      },
      error: (err) => console.error('[CampaignList] Delete failed:', err),
    });
  }
  onFormSave() {
  this.closeForm();
  const wsId = this.currentWorkspace?.workspaceId;
  if (wsId) {
    this.loadCampaigns(wsId);   // refresh list
  }
}
  // ---------- Helpers ----------
  isEditor(): boolean {
    return this.currentWorkspace?.role !== 'Viewer';
  }

  getTemplateName(c: Campaign): string {
    if (!c.templateId) return '—';
    return typeof c.templateId === 'string' ? c.templateId : c.templateId.name ?? '—';
  }

  launchCampaign(c: Campaign) {
  this.campaignService.launchCampaign(c._id).subscribe({
    next: () => this.loadCampaigns(this.currentWorkspace!.workspaceId),
    error: (err) => console.error('Failed to launch campaign', err),
  });
}

}
