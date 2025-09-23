import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConfig } from '../../config';

export interface WorkspaceAnalytics {
  campaignsPerDay: { date: string; count: number }[];
  messagesByType: { type: string; count: number }[];
  contactsReached: { reached: number; notReached: number };
  recentCampaigns: { name: string; tags?: string[]; selectedTags?: string[] }[];
  topTags: { tag: string; count: number }[];
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private baseUrl = `${AppConfig.apiUrl}/analytics`;

  constructor(private http: HttpClient) {}

  getWorkspaceAnalytics(
    workspaceId: string,
    startDate?: string,
    endDate?: string
  ): Observable<WorkspaceAnalytics> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<WorkspaceAnalytics>(
      `${this.baseUrl}/${workspaceId}`,
      { params }
    );
    
  }
}
