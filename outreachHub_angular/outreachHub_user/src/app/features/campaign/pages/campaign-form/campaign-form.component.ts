import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  DestroyRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  tagsDropdownOpen = false;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignsService,
    private templateService: MessageTemplateService,
    private contactService: ContactService,
    private workspaceService: WorkspaceService,
    private destroyRef: DestroyRef
  ) {}

  // 🔹 Lifecycle hooks
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

  // 🔹 Form setup
  private initForm() {
    this.form = this.fb.group({
      name: [this.campaign?.name || '', Validators.required],
      templateId: [this.campaign?.templateId || '', Validators.required],
      selectedTags: [this.campaign?.selectedTags || []],
      description: [this.campaign?.description || ''],
    });

    // Disable if view mode OR campaign not Draft
    if (this.mode === 'view' || (this.mode === 'edit' && this.campaign?.status !== 'Draft')) {
    this.form.disable();
  }
    this.updateAudienceCount(this.form.value.selectedTags);
  }

  // 🔹 Load workspace data (templates + tags)
  private loadWorkspaceData() {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId) return;

    this.templateService
      .getAllByWorkspace(wsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (t) => (this.templates = t ?? []),
        error: () => (this.templates = []),
      });

    this.contactService
      .getTagsByWorkspace(wsId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (tags) => (this.availableTags = tags ?? []),
        error: () => (this.availableTags = []),
      });
  }

  // 🔹 Keep audience count in sync
  private subscribeTagChanges() {
    this.form
      .get('selectedTags')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((tags: string[]) => this.updateAudienceCount(tags));
  }

  private updateAudienceCount(tags: string[] = []) {
    const wsId = this.workspaceService.getWorkspaceId();
    if (!wsId || tags.length === 0) {
      this.audienceTargeted = 0;
      return;
    }

    this.contactService
      .countByTags(wsId, tags)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (count) => (this.audienceTargeted = count),
        error: () => (this.audienceTargeted = 0),
      });
  }

  // 🔹 Tag toggle
  toggleTag(tag: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const current = new Set<string>(this.form.value.selectedTags || []);

    checked ? current.add(tag) : current.delete(tag);

    this.form.patchValue({ selectedTags: [...current] });
  }

  // 🔹 Save / Cancel
  onSubmit() {
    if (this.form.invalid || this.mode === 'view') return;

    const ws = this.workspaceService.getWorkspace();
    if (!ws?.workspaceId) {
      alert('Please select a workspace.');
      return;
    }

    const payload = { ...this.form.getRawValue(), workspaceId: ws.workspaceId };

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
