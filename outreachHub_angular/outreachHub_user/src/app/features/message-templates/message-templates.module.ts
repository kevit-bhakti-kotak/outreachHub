import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { MessageTemplatesRoutingModule } from './message-templates-routing.module';

import { TemplateListComponent } from './pages/template-list/template-list.component';
import { TemplateDetailComponent } from './pages/template-detail/template-detail.component';
import { TemplateFormComponent } from './pages/template-form/template-form.component';

@NgModule({
  declarations: [
    TemplateListComponent,
    TemplateDetailComponent,
    TemplateFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    LucideAngularModule,
    MessageTemplatesRoutingModule,
  ],
})
export class MessageTemplatesModule {}
