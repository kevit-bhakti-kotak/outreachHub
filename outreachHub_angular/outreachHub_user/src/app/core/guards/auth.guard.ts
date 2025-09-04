import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = this.auth.getToken();
    if (!token) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    const expectedRoles = route.data['roles'] as string[];
    if (expectedRoles?.length) {
      const hasRole = expectedRoles.some(r => this.auth.hasRole(r));
      if (!hasRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
