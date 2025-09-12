import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
// import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  // default: redirect to login 
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  // Auth layout: /auth/... routes
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      // lazy-load the auth module. AuthModule's routing should handle 'login' and 'register' paths.
      { path: '', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }
    ]
  },

  // Main app layout: /home, /contacts, /campaigns etc.
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard], 
    children: [
      { path: 'home', loadChildren: () => import('./features/home/home.module').then(m => m.HomeModule) },
       { path: 'contacts', loadChildren: () => import('./features/contacts/contacts.module').then(m => m.ContactsModule) },
      { path: 'campaigns', loadChildren: () => import('./features/campaign/campaign.module').then(m => m.CampaignsModule) },
      {path: 'message-templates', loadChildren: ()=> import('./features/message-templates/message-templates.module').then(m=> m.MessageTemplatesModule)},
    ],
  },

  // fallback
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
