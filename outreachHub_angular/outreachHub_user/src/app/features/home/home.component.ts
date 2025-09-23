import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { AnalyticsService, WorkspaceAnalytics } from '../../core/services/analytics.service';
import { WorkspaceService } from '../../core/services/workspace.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // Charts
  campaignsChartType: ChartConfiguration['type'] = 'line';
  campaignsChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  campaignsChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  messagesChartType: ChartConfiguration['type'] = 'bar';
  messagesChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  messagesChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  contactsChartType: ChartConfiguration['type'] = 'pie';
  contactsChartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  contactsChartOptions: ChartOptions = { responsive: true, maintainAspectRatio: false };

  // Tables
  recentCampaigns: { name: string; tags: string[] }[] = [];
  topTags: { tag: string; count: number }[] = [];

  constructor(private analyticsService: AnalyticsService,
    private workspaceService: WorkspaceService
  ) {}

 ngOnInit(): void {
  // Subscribe to workspace changes
  this.workspaceService.selectedWorkspace$.subscribe(ws => {
    if (ws?.workspaceId) {
      // Load analytics for the selected workspace
      this.loadAnalytics(ws.workspaceId);
    } else {
      console.warn('No workspace selected yet.');
    }
  });
}

  loadAnalytics(workspaceId: string, startDate?: string, endDate?: string) {
    this.analyticsService.getWorkspaceAnalytics(workspaceId, startDate, endDate).subscribe({
      next: (data: WorkspaceAnalytics) => {
        // Map campaignsPerDay to use 'date' instead of '_id'
        const campaigns = data.campaignsPerDay.map(d => ({
          date: d.date,
          count: d.count
        }));

        this.campaignsChartData = {
          labels: campaigns.map(c => c.date),
          datasets: [{
            data: campaigns.map(c => c.count),
            label: 'Campaigns',
            borderColor: '#EB8A90',
            backgroundColor: 'rgba(235,138,144,0.3)',
            fill: true,
            tension: 0.3,
          }]
        };

        // Messages by type (ensure both Text and Text+Image always exist)
        const messagesByType = ['Text', 'Text+Image'].map(type => {
          const found = data.messagesByType.find(m => m.type === type);
          return { type, count: found ? found.count : 0 };
        });

        this.messagesChartData = {
          labels: messagesByType.map(m => m.type),
          datasets: [{
            data: messagesByType.map(m => m.count),
            label: 'Messages',
            backgroundColor: ['#031927', '#EB8A90', '#FCDFD1']
          }]
        };

        // Contacts reached
        this.contactsChartData = {
          labels: ['Reached', 'Not Reached'],
          datasets: [{
            data: [80,20],
            backgroundColor: ['#EB8A90', '#031927']
          }]
        };

        // Tables
        this.recentCampaigns = data.recentCampaigns.map(c => ({
          name: c.name,
          tags: c.selectedTags || c.tags || []
        }));

        this.topTags = data.topTags.map(t => ({
          tag: t.tag,
          count: t.count
        }));
      },
      error: (err) => console.error('Analytics fetch failed', err)
    });
  }
}
