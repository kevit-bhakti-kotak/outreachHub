import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../../../src/config';

export interface Workspace {
  _id: string;
  name: string;
  createdBy: { _id: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class AdminWorkspaceService {
  private baseUrl = `${AppConfig.apiUrl}/workspaces`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Workspace[]> {
    return this.http.get<Workspace[]>(this.baseUrl);
  }

  getById(id: string): Observable<Workspace> {
    return this.http.get<Workspace>(`${this.baseUrl}/${id}`);
  }

  create(workspace: { name: string }): Observable<Workspace> {
    return this.http.post<Workspace>(this.baseUrl, workspace);
  }

  update(id: string, workspace: { name: string }): Observable<Workspace> {
    return this.http.patch<Workspace>(`${this.baseUrl}/${id}`, workspace);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  addUsers(workspaceId: string, users: { email: string; role: string }[]): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/${workspaceId}/users`, { users });
  }

   removeUser(workspaceId: string, userId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${workspaceId}/users/${userId}`);
  }
  // create a user (optionally include workspaces to auto-assign)
 // Add existing user to workspace
addUserToWorkspace(workspaceId: string, email: string, role: 'Editor' | 'Viewer') {
  return this.http.post(`/api/workspaces/${workspaceId}/users`, {
    users: [{ email, role }]
  });
}

// Create brand new user in DB
createUser(payload: any) {
  return this.http.post(`${AppConfig.apiUrl}/users`, payload,{
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
}
//update user role in ws
updateUserRole(workspaceId: string, userId: string, newRole: 'Editor' | 'Viewer'): Observable<any> {
    const token = localStorage.getItem('token'); // JWT from login
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.patch(
      `${AppConfig.apiUrl}/workspaces/${workspaceId}/users/${userId}`,
      { role: newRole },
      { headers }
    );
  }

}
