// app/features/campaigns/services/campaigns.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Campaign } from '../campaign/model/campaign.model';

@Injectable({
  providedIn: 'root',
})
export class CampaignsService {
  private readonly baseUrl = 'http://localhost:2000/campaigns';

  constructor(private http: HttpClient) {}

  launchCampaign(id: string): Observable<Campaign> {
  return this.http.patch<Campaign>(`${this.baseUrl}/${id}/launch`, {});
}

  getCampaigns(page: number, limit: number, workspaceId?: string): Observable<{ data: Campaign[]; total: number }> {
    let url = `${this.baseUrl}?page=${page}&limit=${limit}`;
    if (workspaceId) {
      url += `&workspaceId=${workspaceId}`;
    }
    return this.http.get<{ data: Campaign[]; total: number }>(url);
  }

  getAllByWorkspace(workspaceId: string, page = 1, limit = 5): Observable<{ data: Campaign[]; total: number }> {
    return this.http.get<{ data: Campaign[]; total: number }>(
      `${this.baseUrl}?workspaceId=${workspaceId}&page=${page}&limit=${limit}`
    );
  }

  get(id: string): Observable<Campaign> {
    return this.http.get<Campaign>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Campaign>): Observable<Campaign> {
    return this.http.post<Campaign>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Campaign>): Observable<Campaign> {
    return this.http.patch<Campaign>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  copyCampaign(id: string): Observable<Campaign> {
  return this.http.post<Campaign>(`${this.baseUrl}/${id}/copy`, {});
}
}
