// app/core/interceptors/auth-token.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { WorkspaceService } from './services/workspace.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private workspaceService: WorkspaceService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 🔹 Robust way to detect auth endpoints you want to skip
    const isAuthEndpoint = /\/auth\/(login)/.test(req.url);

    if (isAuthEndpoint) {
      // Never attach token or block auth endpoints
      return next.handle(req);
    }

    const token = this.auth.getToken();

    // 🔹 If a token exists and is expired, logout and cancel this request
    if (token && this.auth.isTokenExpired(token)) {
      this.auth.logout();
      return throwError(() => new Error('Token expired. Logged out.'));
    }
    const workspaceId = this.workspaceService.getWorkspaceId();

    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (workspaceId) headers['X-Workspace-Id'] = workspaceId;


    // 🔹 Attach Authorization header if token exists
    const authReq = token
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

    // 🔹 Forward request and handle 401/403 globally
    return next.handle(authReq).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401 || error.status === 403) {
            this.auth.logout();
          }
        }
        return throwError(() => error);
      })
    );
  }
}
