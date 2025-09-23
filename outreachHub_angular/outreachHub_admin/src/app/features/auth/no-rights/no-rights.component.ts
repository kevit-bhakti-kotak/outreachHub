import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-rights',
  templateUrl: './no-rights.component.html'
})
export class NoRightsComponent {
  constructor(private router: Router) {}
  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
