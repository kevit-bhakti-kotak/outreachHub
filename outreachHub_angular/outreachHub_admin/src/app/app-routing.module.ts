import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { NoRightsComponent } from './features/auth/no-rights/no-rights.component';

const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'no-rights', component: NoRightsComponent },
  { path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) },
  { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),  canActivate: [AuthGuard] },
  { path: 'workspaces', loadChildren: () => import('./features/workspaces/workspaces.module').then(m => m.WorkspacesModule),  canActivate: [AuthGuard] },
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
