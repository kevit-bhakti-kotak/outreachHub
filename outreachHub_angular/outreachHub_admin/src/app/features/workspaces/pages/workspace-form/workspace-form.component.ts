import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminWorkspaceService, Workspace } from '../../../../core/services/workspace.service';
import { AuthService } from '../../../../core/services/auth.service';

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
  isLoading = false;
  currentUserId: string | null = null;

  constructor(private fb: FormBuilder, private wsService: AdminWorkspaceService, private router: Router, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();
    // Determine mode based on route
    const id = this.route.snapshot.params['id'];
    if (id && this.route.snapshot.url.some(segment => segment.path === 'edit')) {
      this.mode = 'edit';
      this.loadWorkspace(id);
    } else if (id) {
      this.mode = 'view';
      this.loadWorkspace(id);
    } else {
      this.mode = 'create';
    }

    this.form = this.fb.group({
      name: [this.workspace?.name || '', Validators.required]
    });

    if (this.mode === 'view') {
      this.form.disable();
    }
  }

  loadWorkspace(id: string) {
    this.wsService.getById(id).subscribe({
      next: (ws) => {
        this.workspace = ws;
        this.form.patchValue({ name: ws.name });

        // If edit mode and not owner, redirect to view
        if (this.mode === 'edit' && ws.createdBy?._id !== this.currentUserId) {
          this.router.navigate(['/workspaces', id]);
        }
      },
      error: (err) => console.error('Failed to load workspace', err)
    });
  }

  onSubmit() {
    if (this.form.invalid || this.mode === 'view') return;

    this.isLoading = true;
    const value = this.form.value;
    const req$ =
      this.mode === 'edit' && this.workspace
        ? this.wsService.update(this.workspace._id, value)
        : this.wsService.create(value);

    req$.subscribe({
      next: () => {
        this.isLoading = false;
        // Navigate back to list after success
        this.router.navigate(['/workspaces']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Save failed', err);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/workspaces']);
  }
}
