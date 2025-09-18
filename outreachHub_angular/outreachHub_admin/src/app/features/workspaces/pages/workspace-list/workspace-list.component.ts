import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html'
})
export class WorkspaceListComponent implements OnInit {
  workspaces: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadWorkspaces();
  }

  loadWorkspaces() {
    this.http.get<any[]>('http://localhost:2000/workspaces').subscribe({
      next: (data) => this.workspaces = data,
      error: (err) => console.error('Failed to fetch workspaces', err)
    });
  }

  openDetail(id: string) {
    this.router.navigate(['/workspaces', id]);
  }

  openCreate() {
    this.router.navigate(['/workspaces/create']);
  }
}
