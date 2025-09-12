import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CampaignsService } from '../../campaigns.service';
import { MessageTemplateService } from '../../../message-templates/message-template.service';
import { WorkspaceService, NormalizedWorkspace } from '../../../../core/services/workspace.service';
import { ContactService } from '../../../contacts/contact.service';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  templates: any[] = [];
  availableTags: string[] = [];
  audienceTargeted = 0;

  isEdit = false;
  id: string | null = null;
  private subs = new Subscription();

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private templateService: MessageTemplateService,
    private contactService: ContactService,
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      templateId: ['', Validators.required],
      selectedTags: [[]], // ✅ always an array
      description: [''],
    });

    // Edit mode
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.campaignService.get(this.id).subscribe((data) => {
        const patch: any = { ...data };
        patch.selectedTags = Array.isArray(patch.selectedTags) ? patch.selectedTags : [];
        this.form.patchValue(patch);
        this.updateAudienceCount(patch.selectedTags);
      });
    }

    // Workspace change
    this.subs.add(
      this.workspaceService.selectedWorkspace$.subscribe((ws: NormalizedWorkspace | null) => {
        if (ws?.workspaceId) {
          this.loadTemplates(ws.workspaceId);
          this.loadTags(ws.workspaceId);
        } else {
          this.templates = [];
          this.availableTags = [];
        }
      })
    );

    // Tags change → recalc audience
    this.subs.add(
      this.form.get('selectedTags')!.valueChanges.subscribe((tags: string[]) => {
        this.updateAudienceCount(tags || []);
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  private loadTemplates(workspaceId: string) {
    this.templateService.getAllByWorkspace(workspaceId).subscribe({
      next: (t) => (this.templates = t || []),
      error: (err) => {
        console.error('Failed to load templates', err);
        this.templates = [];
      },
    });
  }

  private loadTags(workspaceId: string) {
    this.contactService.getTagsByWorkspace(workspaceId).subscribe({
      next: (tags) => (this.availableTags = tags || []),
      error: (err) => {
        console.error('[CampaignForm] Failed to load tags', err);
        this.availableTags = [];
      },
    });
  }

  // ✅ proper handler for <select multiple>
  onTagsSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map((o) => o.value);
    this.form.get('selectedTags')?.setValue(selected);
    this.updateAudienceCount(selected);
  }

  private updateAudienceCount(tags: string[] = []) {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId || tags.length === 0) {
      this.audienceTargeted = 0;
      return;
    }
    this.contactService.countByTags(wsId, tags).subscribe({
      next: (count) => (this.audienceTargeted = count),
      error: (err) => {
        console.error('[CampaignForm] Failed to count audience', err);
        this.audienceTargeted = 0;
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const ws = this.workspaceService.getWorkspace();
    if (!ws?.workspaceId) {
      alert('Please select a workspace.');
      return;
    }

    const payload = {
      ...this.form.value,
      workspaceId: ws.workspaceId,
    };

    const req$ = this.isEdit && this.id
      ? this.campaignService.update(this.id, payload)
      : this.campaignService.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/campaigns']),
      error: (err) => console.error('Failed to save campaign', err),
    });
  }

  cancel() {
    this.router.navigate(['/campaigns']);
  }
}
