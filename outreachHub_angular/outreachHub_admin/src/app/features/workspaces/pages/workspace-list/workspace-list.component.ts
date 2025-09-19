import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-workspace-list',
  templateUrl: './workspace-list.component.html'
})
export class WorkspaceListComponent implements OnInit, OnDestroy {
  workspaces: any[] = [];
  private routerSub: Subscription = new Subscription();
  currentUserId: string | null = null;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId();
    this.loadWorkspaces();
    // Subscribe to router events to reload on navigation back to this route
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd && event.url === '/workspaces') {
          this.loadWorkspaces();
        }
      });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  loadWorkspaces() {
    this.http.get<any[]>('http://localhost:2000/workspaces').subscribe({
      next: (data) => this.workspaces = data,
      error: (err) => console.error('Failed to fetch workspaces', err)
    });
  }

  isOwner(ws: any): boolean {
    return ws.createdBy?._id === this.currentUserId;
  }

  openDetail(id: string) {
    this.router.navigate(['/workspaces', id]);
  }

  editWorkspace(id: string) {
    this.router.navigate(['/workspaces', id, 'edit']);
  }

  deleteWorkspace(ws: any) {
    if (!confirm(`Delete workspace "${ws.name}"?`)) return;
    this.http.delete(`http://localhost:2000/workspaces/${ws._id}`).subscribe({
      next: () => this.loadWorkspaces(),
      error: (err) => console.error('Failed to delete workspace', err)
    });
  }
  openWorkspace(ws: any) {
  if (this.isOwner(ws)) {
    this.router.navigate(['/workspaces', ws._id]);
  } else {
    this.router.navigate(['workspaces/no-access']); // 🚨 redirect to your no-access route
  }
}


  openCreate() {
    this.router.navigate(['/workspaces/create']);
  }
}
