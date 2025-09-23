// app/features/campaigns/campaigns-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignListComponent } from './pages/campaign-list/campaign-list.component';
import { CampaignDetailComponent } from './pages/campaign-detail/campaign-detail.component';
import { CampaignFormComponent } from './pages/campaign-form/campaign-form.component';

const routes: Routes = [
  { path: '', component: CampaignListComponent },         
  { path: 'create', component: CampaignFormComponent },
  { path: ':id', component: CampaignDetailComponent },
  { path: ':id/edit', component: CampaignFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CampaignRoutingModule {}


