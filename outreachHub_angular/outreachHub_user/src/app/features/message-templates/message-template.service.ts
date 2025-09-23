import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageTemplateService {
  private apiUrl = 'http://localhost:2000/message-templates';
  

  constructor(private http: HttpClient) {}

  getAllByWorkspace(workspaceId: string) {
  return this.http.get<any[]>(`http://localhost:2000/message-templates?workspaceId=${workspaceId}`);
  }

  get(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  create(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  update(id: string, data: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
