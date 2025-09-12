import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
  audienceModalOpen = false;
  audienceContacts: any[] = [];

  constructor(
    private campaignService: CampaignsService,
    private workspaceService: WorkspaceService,
    private contactService: ContactService,
    private router: Router
  ) {}

  ngOnInit() {
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

  private loadCampaigns(workspaceId: string) {
    this.campaignService.getAllByWorkspace(workspaceId).subscribe({
      next: (data) => {
        this.campaigns = (data ?? []).map(c => ({ ...c, audienceCount: 0 }));
        this.campaigns.forEach(c => this.fetchAudienceCount(c));
      },
      error: (err) => console.error('Error fetching campaigns:', err),
    });
  }

  private fetchAudienceCount(c: Campaign) {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId || !c.selectedTags?.length) {
      c.audienceCount = 0;
      return;
    }
    this.contactService.countByTags(wsId, c.selectedTags).subscribe({
      next: (count) => c.audienceCount = count,
      error: () => c.audienceCount = 0
    });
  }

  viewAudience(c: Campaign) {
  const wsId = this.workspaceService.getWorkspaceId();
  if (!wsId || !c.selectedTags?.length) return;

  this.contactService.getContactsByTags(wsId, c.selectedTags).subscribe({
    next: (contacts) => {
      this.audienceContacts = contacts;
      this.audienceModalOpen = true;
    }
  });
}

closeAudienceModal() {
  this.audienceModalOpen = false;
  this.audienceContacts = [];
}

  createCampaign() { this.router.navigate(['/campaigns/create']); }
  editCampaign(id: string) { this.router.navigate(['/campaigns', id, 'edit']); }
  viewCampaign(id: string) { this.router.navigate(['/campaigns', id]); }

  deleteCampaign(id: string) {
    if (!confirm('Delete this campaign?')) return;
    this.campaignService.delete(id).subscribe({
      next: () => {
        const wsId = this.workspaceService.getWorkspaceId();
        if (wsId) this.loadCampaigns(wsId);
      },
      error: (err) => console.error('Delete failed', err),
    });
  }

  isEditor(): boolean {
    return this.currentWorkspace?.role !== 'Viewer';
  }

  getTemplateName(c: Campaign): string {
    if (!c.templateId) return '—';
    return typeof c.templateId === 'string' ? c.templateId : c.templateId.name ?? '—';
  }
}
