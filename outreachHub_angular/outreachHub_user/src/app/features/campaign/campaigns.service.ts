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

  launchCampaign(id: string) {
  return this.http.patch(`/api/campaigns/${id}/launch`, {});
}

  getAllByWorkspace(workspaceId: string): Observable<Campaign[]> {
    return this.http.get<Campaign[]>(`${this.baseUrl}?workspaceId=${workspaceId}`);
  }

  getCampaigns(page: number, limit: number) {
  return this.http.get(`/api/campaigns?page=${page}&limit=${limit}`);
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
}
