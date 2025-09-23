// src/app/shared/components/header/header.component.ts
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { AdminWorkspaceService } from '../../../core/services/workspace.service';

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
    public workspaceService: AdminWorkspaceService // public so template can access if needed
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
  const adminUserRaw = localStorage.getItem('adminUser');
  if (adminUserRaw) {
    try {
      const adminUser = JSON.parse(adminUserRaw);
      if (adminUser?.name) {
        this.userName = adminUser.name;
        return;
      }
    }catch (e) {
      console.warn('Invalid adminUser in localStorage', e);
    }
  }
    this.userName = 'User';
  }
}
