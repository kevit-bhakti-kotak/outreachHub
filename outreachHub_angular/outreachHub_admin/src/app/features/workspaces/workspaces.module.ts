import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from './pages/workspace-form/workspace-form.component';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';


@NgModule({
  declarations: [
    WorkspaceListComponent,
    WorkspaceFormComponent,
    WorkspaceDetailComponent
  ],
  imports: [
    CommonModule,
    WorkspacesRoutingModule
  ]
})
export class WorkspacesModule { }
