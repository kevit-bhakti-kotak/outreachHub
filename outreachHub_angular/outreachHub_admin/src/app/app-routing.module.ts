import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './features/auth/login/login.component';
import { NoRightsComponent } from './features/auth/no-rights/no-rights.component';

const routes: Routes = [
  // Auth pages → no sidebar/header
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }
    ]
  },
  { path: 'no-rights', component: NoRightsComponent },

  // Main app pages → with sidebar/header
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard] },
      { path: 'workspaces', loadChildren: () => import('./features/workspaces/workspaces.module').then(m => m.WorkspacesModule), canActivate: [AuthGuard] },
    ]
  },

  // Default / fallback
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
