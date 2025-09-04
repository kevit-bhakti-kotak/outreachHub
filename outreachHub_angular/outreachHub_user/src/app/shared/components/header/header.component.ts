// src/app/shared/components/header/header.component.ts
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { WorkspaceService, NormalizedWorkspace } from '../../../core/services/workspace.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() isSidebarOpen = true;

  userName = 'User';
  currentDate = new Date();
  currentTime = '';
  isScrolled = false;

  private timeIntervalId: any;
  private subs = new Subscription();

  user: any = null;
  workspaces: any[] = [];
  selectedWorkspaceId: string | null = null;

  constructor(
    private authService: AuthService,
    public workspaceService: WorkspaceService // public so template can access if needed
  ) {}

  ngOnInit(): void {
    this.deriveUserName();
    this.updateTime();
    this.timeIntervalId = setInterval(() => this.updateTime(), 1000);

    // 🔹 Subscribe to AuthService current user (always up to date)
    this.subs.add(
      this.authService.currentUser$.subscribe((user) => {
        this.user = user;
        this.workspaces = user?.workspaces || [];
      })
    );

    // 🔹 Sync selected workspace with service
    const init = this.workspaceService.getWorkspace();
    this.selectedWorkspaceId = init?.workspaceId ?? null;

    this.subs.add(
      this.workspaceService.selectedWorkspace$.subscribe((ws: NormalizedWorkspace | null) => {
        this.selectedWorkspaceId = ws?.workspaceId ?? null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.timeIntervalId) clearInterval(this.timeIntervalId);
  }

  logout() {
    this.authService.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 8;
  }

  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    this.currentDate = now;
  }

  private deriveUserName() {
    const storedName = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (storedName && storedName.trim().length) {
      this.userName = storedName;
      return;
    }

    if (email && email.includes('@')) {
      const namePart = email.split('@')[0];
      const cleaned = namePart.replace(/[\.\_\-]/g, ' ').trim();
      this.userName = cleaned
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      return;
    }

    this.userName = 'User';
  }

  // Called by template when user selects a workspace
  onWorkspaceChangeById(selectedId: string) {
    const selectedWs = this.workspaces.find((w) => {
      const idFromWs =
        (w.workspaceId && (w.workspaceId._id ?? w.workspaceId)) ??
        (w._id ?? w.id);
      return String(idFromWs) === String(selectedId);
    });

    if (selectedWs) {
      this.workspaceService.setWorkspace(selectedWs);
      console.log('Workspace switched to', selectedWs);
    } else {
      console.warn('Workspace with id not found in local list:', selectedId);
    }
  }
}
