import { Component, OnInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CampaignsService } from '../../campaigns.service';
import { MessageTemplateService } from '../../../message-templates/message-template.service';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { ContactService } from '../../../contacts/contact.service';
import { Campaign } from '../../model/campaign.model';

@Component({
  selector: 'app-campaign-form',
  templateUrl: './campaign-form.component.html',
})
export class CampaignFormComponent implements OnInit, OnChanges {
  @Input() campaign: Campaign | null = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  templates: any[] = [];
  availableTags: string[] = [];
  audienceTargeted = 0;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private templateService: MessageTemplateService,
    private contactService: ContactService,
    private workspaceService: WorkspaceService
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadWorkspaceData();
    this.subscribeTagChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['campaign'] || changes['mode']) {
      this.initForm();
    }
  }

  private initForm() {
    this.form = this.fb.group({
      name: [this.campaign?.name || '', Validators.required],
      templateId: [this.campaign?.templateId || '', Validators.required],
      selectedTags: [this.campaign?.selectedTags || []],
      description: [this.campaign?.description || ''],
    });

    if (this.mode === 'view') {
      this.form.disable();
    } else {
      this.form.enable();
    }

    // Update audience count initially
    this.updateAudienceCount(this.campaign?.selectedTags || []);
  }

  private loadWorkspaceData() {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId) return;

    this.templateService.getAllByWorkspace(wsId).subscribe({
      next: (t) => (this.templates = t || []),
      error: () => (this.templates = []),
    });

    this.contactService.getTagsByWorkspace(wsId).subscribe({
      next: (tags) => (this.availableTags = tags || []),
      error: () => (this.availableTags = []),
    });
  }

  private subscribeTagChanges() {
    this.form.get('selectedTags')?.valueChanges.subscribe((tags: string[]) => {
      this.updateAudienceCount(tags || []);
    });
  }

  private updateAudienceCount(tags: string[] = []) {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId || !tags.length) {
      this.audienceTargeted = 0;
      return;
    }

    this.contactService.countByTags(wsId, tags).subscribe({
      next: (count) => (this.audienceTargeted = count),
      error: () => (this.audienceTargeted = 0),
    });
  }

  tagsDropdownOpen = false;

  toggleTag(tag: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const selected = new Set<string>(this.form.value.selectedTags || []);
    if (checked) selected.add(tag);
    else selected.delete(tag);
    const updated = Array.from(selected);
    this.form.get('selectedTags')?.setValue(updated);
    this.updateAudienceCount(updated);
  }

  onSubmit() {
    if (this.form.invalid || this.mode === 'view') return;

    const ws = this.workspaceService.getWorkspace();
    if (!ws?.workspaceId) {
      alert('Please select a workspace.');
      return;
    }

    const payload = { ...this.form.value, workspaceId: ws.workspaceId };

    if (this.mode === 'edit' && this.campaign?._id) {
      this.campaignService.update(this.campaign._id, payload).subscribe({
        next: () => this.save.emit(),
        error: (err) => console.error('Update failed', err),
      });
    } else if (this.mode === 'create') {
      this.campaignService.create(payload).subscribe({
        next: () => this.save.emit(),
        error: (err) => console.error('Create failed', err),
      });
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}
