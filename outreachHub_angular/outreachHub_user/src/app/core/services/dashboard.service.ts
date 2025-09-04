import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DashboardState {
  kpis: {
    campaignsToday: number;
    messagesSent: number;
    contactsReached: number;
  };
  campaignsPerDay: { labels: string[]; values: number[] };
  messagesByType: { labels: string[]; datasets: { label: string; data: number[] }[] };
  recentCampaigns: { name: string; tags: string }[];
  topTags: { tag: string; count: number }[];
}

const initialState: DashboardState = {
  kpis: { campaignsToday: 12, messagesSent: 420, contactsReached: 1280 },
  campaignsPerDay: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], values: [3,5,6,2,8,4,7] },
  messagesByType: {
    labels: ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15'],
    datasets: [
      { label: 'Email', data: [50,60,45,70,60,80,90,45,60,70,55,66,77,88,95] },
      { label: 'SMS', data: [20,18,22,25,30,35,25,20,18,22,26,29,33,30,28] },
      { label: 'Push', data: [10,15,12,18,19,23,21,20,17,14,16,20,22,26,24] },
    ]
  },
  recentCampaigns: [
    { name: 'Welcome Blast', tags: 'Intro, New' },
    { name: 'Promo 1', tags: 'Discount, Email' },
    { name: 'Reactivation', tags: 'Old, SMS' },
    { name: 'Survey Invite', tags: 'Feedback' },
    { name: 'Flash Sale', tags: 'Urgent' },
  ],
  topTags: [
    { tag: 'Promo', count: 1245 },
    { tag: 'Newsletter', count: 980 },
    { tag: 'Feedback', count: 860 },
    { tag: 'Active', count: 745 },
    { tag: 'Lead', count: 710 },
  ]
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private state$ = new BehaviorSubject<DashboardState>(initialState);
  public readonly data$ = this.state$.asObservable();

  constructor() {
    // Simulate periodic updates that change KPIs and chart values
    interval(5000).pipe(
      map(() => this.randomize())
    ).subscribe(next => this.state$.next(next));
  }

  // Return current snapshot (useful for immediate chart initializations)
  getSnapshot() {
    return this.state$.getValue();
  }

  // Replace this with an HTTP call to your backend when ready
  fetchFromApi() {
    // example: return this.http.get<DashboardState>('/api/dashboard');
    return this.data$;
  }

  // small function to randomize numbers to simulate "live" updates
  private randomize(): DashboardState {
    const prev = this.state$.getValue();
    const random = (v: number) => Math.max(0, Math.round(v * (0.9 + Math.random() * 0.3)));
    const newKpis = {
      campaignsToday: random(prev.kpis.campaignsToday) + Math.floor(Math.random()*3),
      messagesSent: random(prev.kpis.messagesSent) + Math.floor(Math.random()*20),
      contactsReached: random(prev.kpis.contactsReached) + Math.floor(Math.random()*50)
    };

    // shift campaignsPerDay values
    const cpd = prev.campaignsPerDay;
    const shifted = cpd.values.slice(1);
    shifted.push(Math.max(1, Math.round((shifted[shifted.length-1] || 3) * (0.6 + Math.random()*1.4))));
    const campaignsPerDay = { labels: cpd.labels, values: shifted };

    // update messagesByType randomly
    const mbt = prev.messagesByType;
    const datasets = mbt.datasets.map(ds => ({
      label: ds.label,
      data: ds.data.map(v => Math.max(0, Math.round(v * (0.85 + Math.random()*0.3))))
    }));

    return {
      ...prev,
      kpis: newKpis,
      campaignsPerDay,
      messagesByType: { labels: mbt.labels, datasets },
      // recentCampaigns/topTags can be same or lightly shuffled
      recentCampaigns: prev.recentCampaigns,
      topTags: prev.topTags
    };
  }
}
