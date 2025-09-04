// app/core/interceptors/token.interceptor.ts
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 1️⃣ Skip auth endpoints
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req);
    }

    const token = this.authService.getToken();

    // 2️⃣ If token exists, check expiry
    if (token && this.authService.isTokenExpired(token)) {
      this.authService.logout();
      // Optionally, stop request by throwing an error
      throw new Error('Token expired. Logged out.');
    }

    // 3️⃣ Add Authorization header if token exists
    const authReq = token
      ? req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) })
      : req;

    return next.handle(authReq);
  }
}
