import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CampaignRoutingModule } from './campaign-routing.module';

import { CampaignListComponent } from './pages/campaign-list/campaign-list.component';
import { CampaignFormComponent } from './pages/campaign-form/campaign-form.component';
import { CampaignDetailComponent } from './pages/campaign-detail/campaign-detail.component';
import { AudienceModalComponent } from './pages/audience-modal/audience-modal.component';

@NgModule({
  declarations: [
    CampaignListComponent,
    CampaignFormComponent,
    CampaignDetailComponent,
    AudienceModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CampaignRoutingModule
  ]
})
export class CampaignsModule {}
