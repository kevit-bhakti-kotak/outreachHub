import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageTemplateService } from '../../message-template.service';
import { NormalizedWorkspace, WorkspaceService } from '../../../../core/services/workspace.service';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
})
export class TemplateListComponent implements OnInit {
  templates: any[] = [];

  constructor(private service: MessageTemplateService, private router: Router,  private workspaceService: WorkspaceService) {}

  

ngOnInit() {
  this.workspaceService.selectedWorkspace$.subscribe((ws: NormalizedWorkspace | null) => {
    if (ws?.workspaceId) {
      this.loadTemplates(ws.workspaceId);
    } else {
      this.templates = [];
    }
  });
}

private loadTemplates(workspaceId?: string) {
  const id = workspaceId ?? this.workspaceService.getWorkspaceId();
  if (!id) {
    this.templates = [];
    return;
  }

  this.service.getAllByWorkspace(id).subscribe({
    next: (data) => (this.templates = data),
    error: (err) => console.error('Error fetching templates:', err),
  });
}

  createTemplate() {
    this.router.navigate(['/message-templates/create']);
  }

  viewTemplate(id: string) {
    this.router.navigate(['/message-templates', id]);
  }

  editTemplate(id: string) {
  this.router.navigate(['/message-templates', id, 'edit']);
  }

  deleteTemplate(id: string) {
    if (confirm('Are you sure you want to delete this template?')) {
      this.service.delete(id).subscribe(() => this.loadTemplates());
    }
  }
}
