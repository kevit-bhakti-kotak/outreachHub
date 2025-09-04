import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'outreachHub_user';
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // This will auto-logout if token is expired
    // this.authService.autoLogoutOnExpiry();
     if (this.authService.isAuthenticated()) {
    this.authService.fetchUserData();
  }
  }
}

