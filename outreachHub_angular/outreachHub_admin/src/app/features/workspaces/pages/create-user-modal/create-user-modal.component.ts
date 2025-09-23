import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AdminWorkspaceService } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-create-user-modal',
  templateUrl: './create-user-modal.component.html'
})
export class CreateUserModalComponent implements OnInit {
  @Input() email = '';
  @Input() role: 'Editor'|'Viewer' = 'Viewer';
  @Input() workspaceId!: string;

  @Output() created = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  form!: FormGroup;
  loading = false;
  error?: string;

  constructor(private fb: FormBuilder, private wsService: AdminWorkspaceService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: [this.email, [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      password: ['', [Validators.required]],
      role: [this.role, Validators.required]
    });
  }

  submit() {
    console.log("submit button clicked...")
  if (this.form.invalid) return;
  this.loading = true;
  this.error = undefined;

  const { name, email, phoneNumber, password, role } = this.form.value;

  // Case 1: user already exists (in your flow this would be "Add existing")
  if (!name && !phoneNumber && !password) {
    this.wsService.addUserToWorkspace(this.workspaceId, email, role).subscribe({
      next: (res) => {
        this.loading = false;
        this.created.emit(res);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Add failed';
      }
    });
  }
  // Case 2: create new user
  else {
    const payload = {
      name,
      email,
      phoneNumber,
      password,
      workspaces: [{ workspaceId: this.workspaceId, role }]
    };

    this.wsService.createUser(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.created.emit(res);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Create failed';
      }
    });
  }
}


  cancel() {
    this.cancelled.emit();
  }
}
