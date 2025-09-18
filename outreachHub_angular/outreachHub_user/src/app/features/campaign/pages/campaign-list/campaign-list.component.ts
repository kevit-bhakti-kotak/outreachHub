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


// fetchCampaigns() {
//   this.campaignService
//     .getCampaigns(this.page, this.limit) // assuming backend supports pagination
//     .subscribe((res: any) => {
//       this.campaigns = res.data;
//       this.total = res.total; // total campaigns from backend
//     });
// }

onPageChange(next: boolean) {
  if (next) {
    this.page++;
  } else {
    this.page--;
  }
    const wsId = this.workspaceService.getWorkspaceId();
    if (wsId) this.loadCampaigns(wsId);
}


  ngOnInit() {
    const wsId = this.workspaceService.getWorkspaceId();
    if (wsId) this.loadCampaigns(wsId);
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

  // ---------- Data loading ----------
loadCampaigns(workspaceId: string) {
  this.campaignService.getAllByWorkspace(workspaceId, this.page, this.limit).subscribe({
    next: (res) => {
      const campaigns: Campaign[] = res.data ?? [];
      this.campaigns = campaigns.map((c: Campaign) => ({ ...c, audienceCount: 0 }));
      this.total = res.total ?? campaigns.length;
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

  // inside CampaignListComponent

private pollingSubs: { [campaignId: string]: Subscription } = {};

launchCampaign(c: Campaign) {
  if (c.status !== 'Draft') return;

  // disable the button immediately (optional)
  c.status = 'Running';

  this.campaignService.launchCampaign(c._id).subscribe({
    next: () => {
      // Start polling status
      const poll$ = interval(3000); // every 3 seconds
      this.pollingSubs[c._id] = poll$.subscribe(() => {
        this.campaignService.get(c._id).subscribe({
          next: (res: Campaign) => {
            c.status = res.status;

           if (res.status === 'Completed') {
              this.pollingSubs[c._id]?.unsubscribe();
              delete this.pollingSubs[c._id];

              const wsId = this.currentWorkspace?.workspaceId;
              if (wsId) {
                this.loadCampaigns(wsId); // ✅ reload with correct workspace filter
              }
            }

          },
          error: (err) => console.error('Status polling failed', err),
        });
      });
    },
    error: (err) => {
      console.error('Failed to launch campaign', err);
      c.status = 'Draft'; // revert on failure
    },
  });
}

// unsubscribe on destroy
ngOnDestroy() {
  this.sub.unsubscribe();
  Object.values(this.pollingSubs).forEach((s) => s.unsubscribe());
}
copyCampaign(campaign: Campaign) {
  this.campaignService.copyCampaign(campaign._id).subscribe({
    next: (newCampaign) => {
      // Either push locally
      this.campaigns.unshift(newCampaign);
      // OR reload from backend for accuracy:
        const wsId = this.currentWorkspace?.workspaceId;
              if (wsId) {
                this.loadCampaigns(wsId); // ✅ reload with correct workspace filter
              }    },
    error: (err) => console.error('Failed to copy campaign', err),
  });
}



}
