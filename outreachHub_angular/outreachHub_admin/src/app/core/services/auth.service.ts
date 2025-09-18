import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:2000';  
  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const raw = localStorage.getItem('adminUser');
    if (raw) {
      try {
        this.currentUserSubject.next(JSON.parse(raw));
      } catch {
        localStorage.removeItem('adminUser');
      }
    }
  }

  // 🔹 Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        if (res.token) {
          this.logout(false); // clear old session
          localStorage.setItem('adminToken', res.token);
          this.autoLogoutOnExpiry();
        }
      }),
      switchMap((res) => this.fetchAdminUser(res.token)) // ⬅️ wait until user is fetched
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

  // 🔹 Fetch user & check isAdmin
  fetchAdminUser(token?: any): Observable<any> {
    token = token || this.getToken();
    if (!token) throw new Error('No token found');

    const payload = this.decodeToken(token);
    const userId = payload?.sub;
    if (!userId) throw new Error('Invalid token payload');

    const headers = { Authorization: `Bearer ${token}` };

    return this.http.get<any>(`${this.apiUrl}/users/${userId}`, { headers }).pipe(
      tap((user) => {
        if (!user.isAdmin) {
          console.error('❌ Not an admin');
          this.router.navigate(['/no-rights']);
          return;
        }

        localStorage.setItem('adminUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  // 🔹 Helpers
  getToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  getCurrentUser() {
    return this.currentUserSubject.value || JSON.parse(localStorage.getItem('adminUser') || '{}');
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.isAdmin === true;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && this.isAdmin();
  }

  isTokenExpired(token?: string): boolean {
    token = token || this.getToken()!;
    if (!token) return true;

    try {
      const payload = this.decodeToken(token);
      if (!payload?.exp) return true;
      return Date.now() > payload.exp * 1000;
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

  getUserId(): string | null {
    const user = this.getCurrentUser();
    return user?._id ?? null;
  }

  logout(redirect: boolean = true) {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
    if (redirect) this.router.navigate(['/auth/login']);
  }
}
