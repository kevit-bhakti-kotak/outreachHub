import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WorkspaceService } from './workspace.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:2000';  
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router, private workspaceService: WorkspaceService) {}

  // 🔹 Login
  login(email: string, password: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
    tap((res) => {
      if (res.token) {
        // clear old session
        this.logout(); // 👈 logout without redirect control
        localStorage.setItem('token', res.token);
        localStorage.setItem('email', email);

        this.autoLogoutOnExpiry();

        // fetch user fresh
        this.fetchUserData();
      }
    })
  );
}


  // 🔹 Decode JWT
  decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  // 🔹 Fetch user data (roles, workspaces)
  fetchUserData() {
  const token = this.getToken();
  if (!token) return;
  const payload = this.decodeToken(token);
  const userId = payload?.sub;
  if (!userId) {
    console.error('❌ No userId found in token payload');
    return;
  }

  const headers = { Authorization: `Bearer ${token}` };

  this.http.get<any>(`${this.apiUrl}/users/${userId}`, { headers }).subscribe({
    next: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);

      // restore last selected workspace if valid
      const lastWs = this.workspaceService.getWorkspace();
      if (lastWs && user.workspaces.some((w: any) =>
        String(w.workspaceId?._id ?? w.workspaceId ?? w._id ?? w.id) === lastWs.workspaceId
      )) {
        this.workspaceService.setWorkspace(lastWs);
      } else if (user.workspaces?.length > 0) {
        this.workspaceService.setWorkspace(user.workspaces[0]); // fallback
      }

      console.log('✅ User fetched:', user);
    },
    error: (err) => {
      console.error('❌ Failed to fetch user:', err);
    }
  });
}

 
  
  // 🔹 Get current user
  getCurrentUser() {
    return this.currentUserSubject.value || JSON.parse(localStorage.getItem('user') || '{}');
  }

  // 🔹 Role check
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role);
  }

  // 🔹 Workspaces
  getWorkspaces() {
    const user = this.getCurrentUser();
    return user?.workspaces || [];
  }

  // 🔹 Logout
  logout(redirect: boolean = true) {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('user');
  this.currentUserSubject.next(null);
  this.workspaceService.clearWorkspace();

  if (redirect) {
    this.router.navigate(['/auth/login']);
  }
}


  // 🔹 Helpers
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }


  isTokenExpired(token?: string): boolean {
  if (!token) token = this.getToken()!;
  if (!token) return true;

  try {
    const payload = this.decodeToken(token);
    if (!payload?.exp) return true;

    const expiry = payload.exp * 1000; // exp is in seconds
    return Date.now() > expiry;
  } catch {
    return true;
  }
}

autoLogoutOnExpiry() {
  const token = this.getToken();
  if (!token) return;

  const payload = this.decodeToken(token);
  if (!payload?.exp) return;

  const expiry = payload.exp * 1000;
  const timeout = expiry - Date.now();

  if (timeout <= 0) {
    this.logout();
  } else {
    setTimeout(() => this.logout(), timeout);
  }
}



  }

