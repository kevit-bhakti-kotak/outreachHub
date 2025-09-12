import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CampaignsService } from '../../campaigns.service';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html'
})
export class CampaignDetailComponent implements OnInit {
  campaign: any = null;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignsService,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.campaignService.get(id).subscribe({
        next: (c) => (this.campaign = c),
        error: (err) => console.error('Failed to load campaign', err)
      });
    }
  }

  back() {
    this.router.navigate(['/campaigns']);
  }
}
