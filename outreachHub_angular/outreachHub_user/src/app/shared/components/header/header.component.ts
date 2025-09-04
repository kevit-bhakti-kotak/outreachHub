import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  /** Parent layout passes sidebar state so header can shift */
   constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
  @Input() isSidebarOpen = true;

  userName = 'User';
  currentDate = new Date();
  currentTime = '';
  isScrolled = false;

  private timeIntervalId: any;

  ngOnInit(): void {
    this.deriveUserName();
    this.updateTime();
    this.timeIntervalId = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeIntervalId) {
      clearInterval(this.timeIntervalId);
    }
  }

  // keep header blurred once scrolled a little
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 8;
  }


  private updateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.currentDate = now;
  }

  private deriveUserName() {
    // Priority: stored "username" → stored "email" (derive name) → fallback 'User'
    const storedName = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (storedName && storedName.trim().length) {
      this.userName = storedName;
      return;
    }

    if (email && email.includes('@')) {
      const namePart = email.split('@')[0];
      // Replace separators with spaces and uppercase words
      const cleaned = namePart.replace(/[\.\_\-]/g, ' ').trim();
      this.userName = cleaned.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      return;
    }

    // last fallback
    this.userName = 'User';
  }
}
