import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkspaceListComponent } from './pages/workspace-list/workspace-list.component';
import { WorkspaceFormComponent } from './pages/workspace-form/workspace-form.component';
import { WorkspaceDetailComponent } from './pages/workspace-detail/workspace-detail.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';

const routes: Routes = [
  { path: '', component: WorkspaceListComponent, canActivate: [] },
  { path: 'create', component: WorkspaceFormComponent, canActivate: [] },
  { path: 'no-access', component: NoAccessComponent },
  { path: ':id', component: WorkspaceDetailComponent, canActivate: [] },
  { path: ':id/edit', component: WorkspaceFormComponent, canActivate: [] }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class WorkspacesRoutingModule {}
