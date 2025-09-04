import { Component, OnInit } from '@angular/core';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userName = 'User';

  // -----------------------------
  // Chart 1: Campaigns per Day
  // -----------------------------
  campaignsChartType: ChartConfiguration['type'] = 'line';
  campaignsChartData: ChartConfiguration['data'] = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [12, 19, 14, 22, 30, 25, 28],
        label: 'Campaigns',
        borderColor: '#EB8A90',
        backgroundColor: 'rgba(235,138,144,0.3)',
        fill: true,
        tension: 0.3,
      }
    ]
  };
  campaignsChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // -----------------------------
  // Chart 2: Messages Sent by Type
  // -----------------------------
  messagesChartType: ChartConfiguration['type'] = 'bar';
  messagesChartData: ChartConfiguration['data'] = {
    labels: ['Email', 'SMS', 'WhatsApp'],
    datasets: [
      {
        data: [150, 90, 60],
        label: 'Messages',
        backgroundColor: ['#031927', '#EB8A90', '#FCDFD1']
      }
    ]
  };
  messagesChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  };

  // -----------------------------
  // Chart 3: Contacts Reached
  // -----------------------------
  contactsChartType: ChartConfiguration['type'] = 'pie';
  contactsChartData: ChartConfiguration['data'] = {
    labels: ['Reached', 'Not Reached'],
    datasets: [
      {
        data: [420, 180],
        backgroundColor: ['#EB8A90', '#031927']
      }
    ]
  };
  contactsChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // -----------------------------
  // Table: Recent Campaigns
  // -----------------------------
  recentCampaigns = [
    { name: 'Welcome Blast', tags: 'Intro, New' },
    { name: 'Promo 1', tags: 'Discount, Email' },
    { name: 'Reactivation', tags: 'Old, SMS' },
    { name: 'Survey Invite', tags: 'Feedback' },
    { name: 'Flash Sale', tags: 'Urgent' },
  ];

  // -----------------------------
  // Table: Top Tags
  // -----------------------------
  topTags = [
    { tag: 'Promo', count: 1245 },
    { tag: 'Newsletter', count: 980 },
    { tag: 'Feedback', count: 860 },
    { tag: 'Active', count: 745 },
    { tag: 'Lead', count: 710 },
  ];

  constructor() {}

  ngOnInit(): void {}
}
