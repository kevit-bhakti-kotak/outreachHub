import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AdminWorkspaceService } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-workspace-detail',
  templateUrl: './workspace-detail.component.html'
})
export class WorkspaceDetailComponent implements OnInit {
  workspace: any;
  workspaceForm!: FormGroup;
  usersForm!: FormGroup;
  editMode = false;
  id!: string;

  creatingUser = false;
  pendingUsersQueue: { email: string; role: 'Editor'|'Viewer' }[] = [];
  currentPending?: { email: string; role: 'Editor'|'Viewer' };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private wsService: AdminWorkspaceService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.initForms();
    this.loadWorkspace();
  }

  initForms() {
    this.workspaceForm = this.fb.group({
      name: ['', Validators.required],
    });

    this.usersForm = this.fb.group({
      users: this.fb.array([])
    });
  }

  get users(): FormArray {
    return this.usersForm.get('users') as FormArray;
  }

  loadWorkspace() {
    this.http.get<any>(`http://localhost:2000/workspaces/${this.id}`).subscribe({
      next: (ws) => {
        this.workspace = ws;

        this.workspaceForm.patchValue({ name: ws.name });

        this.users.clear();
        (ws.users || []).forEach((u: any) => {
          this.users.push(this.fb.group({
            _id: [u._id],
            email: [u.email, [Validators.required, Validators.email]],
            role: [u.role, Validators.required]
          }));
        });
      }
    });
  }

  enableEdit() {
    this.editMode = true;
  }

  saveWorkspace() {
    if (this.workspaceForm.invalid) return;
    this.http.patch(`http://localhost:2000/workspaces/${this.id}`, this.workspaceForm.value).subscribe({
      next: () => {
        this.editMode = false;
        this.loadWorkspace();
      }
    });
  }

  deleteWorkspace() {
    if (!confirm('Delete this workspace?')) return;
    this.http.delete(`http://localhost:2000/workspaces/${this.id}`).subscribe({
      next: () => this.router.navigate(['/workspaces'])
    });
  }

  // ---------- Users ----------
  addUserField() {
    this.users.push(this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['Viewer', Validators.required]
    }));
  }

removeUserField(index: number, user: any) {
  this.users.removeAt(index); // remove from form array

  this.wsService.removeUser(this.workspace._id, user._id).subscribe({
    next: () => console.log('User removed from workspace'),
    error: (err: any) => console.error('Failed to remove user:', err),
  });
}


  /** Called when role dropdown changes */
  onRoleChanged(user: any, newRole: 'Editor' | 'Viewer') {
    if (!user._id) return; // only existing users get patched
    this.saveRoleChange(user, newRole);
  }

  /** PATCH request for role change */
  saveRoleChange(user: any, newRole: 'Editor' | 'Viewer') {
    this.wsService.updateUserRole(this.id, user._id, newRole).subscribe({
      next: (updatedWorkspace) => {
        this.workspace = updatedWorkspace;
        this.users.clear();
        (updatedWorkspace.users || []).forEach((u: any) => {
          this.users.push(this.fb.group({
            _id: [u._id],
            email: [u.email, [Validators.required, Validators.email]],
            role: [u.role, Validators.required]
          }));
        });
      },
      error: (err) => {
        console.error('Update failed', err);
      }
    });
  }

  /** POST request for adding new users */
  saveUsers() {
    if (this.usersForm.invalid) return;

    // only send new users (those without _id)
    const newUsers = this.usersForm.value.users.filter((u: any) => !u._id);
    if (newUsers.length === 0) {
      this.loadWorkspace();
      return;
    }

    this.wsService.addUsers(this.id, newUsers).subscribe({
      next: (res: Array<{ email: string; status: string; role?: string }>) => {
        const notFound = res.filter(r => r.status === 'NOT_FOUND');
        if (notFound.length > 0) {
          this.pendingUsersQueue = notFound.map(n => ({ email: n.email, role: (n.role as any) || 'Viewer' }));
          this.openNextCreateModal();
        } else {
          this.loadWorkspace();
        }
      },
      error: (err) => {
        console.error('Add users error', err);
      }
    });
  }

  openNextCreateModal() {
    if (!this.pendingUsersQueue || this.pendingUsersQueue.length === 0) {
      this.loadWorkspace();
      return;
    }
    this.currentPending = this.pendingUsersQueue.shift();
    this.creatingUser = true;
  }

  onUserCreated(newUser: any) {
    this.creatingUser = false;
    this.currentPending = undefined;
    this.openNextCreateModal();
  }

  onModalCancelled() {
    this.creatingUser = false;
    this.pendingUsersQueue = [];
    this.loadWorkspace();
  }
}
