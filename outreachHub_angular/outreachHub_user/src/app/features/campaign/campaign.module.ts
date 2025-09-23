import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CampaignRoutingModule } from './campaign-routing.module';
import { heroEye, heroPencil, heroTrash, heroRocketLaunch, heroDocumentDuplicate } from '@ng-icons/heroicons/outline';

import { CampaignListComponent } from './pages/campaign-list/campaign-list.component';
import { CampaignFormComponent } from './pages/campaign-form/campaign-form.component';
import { CampaignDetailComponent } from './pages/campaign-detail/campaign-detail.component';
import { AudienceModalComponent } from './pages/audience-modal/audience-modal.component';
import { NgIconsModule } from '@ng-icons/core';

@NgModule({
  declarations: [
    CampaignListComponent,
    CampaignFormComponent,
    CampaignDetailComponent,
    AudienceModalComponent
  ],
  imports: [
    CommonModule,
    NgIconsModule.withIcons({
      heroEye,
      heroPencil,
      heroTrash,
      heroRocketLaunch,
      heroDocumentDuplicate
    }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    CampaignRoutingModule,
    
  ]
})
export class CampaignsModule {}
