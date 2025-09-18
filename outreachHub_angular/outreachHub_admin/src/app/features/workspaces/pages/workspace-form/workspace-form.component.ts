import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminWorkspaceService, Workspace } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-workspace-form',
  templateUrl: './workspace-form.component.html'
})
export class WorkspaceFormComponent implements OnInit {
  @Input() workspace: Workspace | null = null;
  @Input() mode: 'create' | 'edit' | 'view' = 'create';
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private wsService: AdminWorkspaceService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.workspace?.name || '', Validators.required]
    });

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  onSubmit() {
    if (this.form.invalid || this.mode === 'view') return;

    const value = this.form.value;
    const req$ =
      this.mode === 'edit' && this.workspace
        ? this.wsService.update(this.workspace._id, value)
        : this.wsService.create(value);

    req$.subscribe({
      next: () => this.save.emit(),
      error: (err) => console.error('Save failed', err)
    });
  }
}
