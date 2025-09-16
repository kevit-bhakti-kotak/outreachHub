import { HttpClient } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Workspace } from "../models/workspace.model";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  private apiUrl = 'http://localhost:2000/workspaces';

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAll() {
    return this.http.get<Workspace[]>(this.apiUrl);
  }

  // create(ws: Partial<Workspace>) {
  //   const adminId = this.auth.getAdminId();
  //   return this.http.post(this.apiUrl, { ...ws, createdBy: adminId });
  // }

  update(id: string, ws: Partial<Workspace>) {
    return this.http.put(`${this.apiUrl}/${id}`, ws);
  }

  delete(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getById(id: string) {
    return this.http.get<Workspace>(`${this.apiUrl}/${id}`);
  }
}
