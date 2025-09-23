import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateListComponent } from './pages/template-list/template-list.component';
import { TemplateDetailComponent } from './pages/template-detail/template-detail.component';
import { TemplateFormComponent } from './pages/template-form/template-form.component';

const routes: Routes = [
  { path: '', component: TemplateListComponent },
  { path: 'create', component: TemplateFormComponent, data: { isEdit: false } },
  { path: ':id', component: TemplateDetailComponent },
  { path: ':id/edit', component: TemplateFormComponent, data: { isEdit: true } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MessageTemplatesRoutingModule {}
