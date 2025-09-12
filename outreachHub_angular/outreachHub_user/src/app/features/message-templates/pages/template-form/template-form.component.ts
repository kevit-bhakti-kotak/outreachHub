import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageTemplateService } from '../../message-template.service';
import { HttpClient } from '@angular/common/http';
import { MessageTemplate } from '../../model/message-template.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
})
export class TemplateFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: MessageTemplateService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['Text', Validators.required],
      message: this.fb.group({
        text: ['', Validators.required],
        imageUrl: ['']
      })
    });

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.isEdit = true;
      this.service.get(this.id).subscribe((data) => {
        this.form.patchValue(data); // fills form in edit mode
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const workspaceObj = JSON.parse(localStorage.getItem('selectedWorkspace') || '{}');
    const workspaceId = workspaceObj.workspaceId?.trim();

    const payload = {
      ...this.form.value,
      workspaceId,
    };

    const request$ = this.isEdit && this.id
      ? this.service.update(this.id, payload)
      : this.service.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/message-templates']),
      error: (err) => console.error('Error saving template:', err),
    });
  }

  cancel() {
    this.router.navigate(['/message-templates']);
  }
}


