import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.auth.getToken();

    // In AuthInterceptor
    if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
      return next.handle(req); // 🔥 Skip login/register
    }


    // 1. Auto logout if token expired
    if (this.auth.isTokenExpired(token ?? undefined)) {
      this.auth.logout();
      return throwError(() => new Error('Token expired'));
    }

    // 2. Attach Authorization header
    let cloned = req;
    if (token) {
      cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(cloned).pipe(
      // 3. Handle errors from backend (401/403 means invalid/roles changed)
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.auth.logout();
        }
        return throwError(() => error);
      })
    );
  }


}
