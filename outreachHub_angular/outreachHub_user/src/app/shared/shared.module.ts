import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule          // ✅ plain RouterModule (no forChild)
  ],
  exports: [
    AuthLayoutComponent,
    MainLayoutComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    RouterModule          // ✅ export so routerLink & router-outlet work
  ]
})
export class SharedModule {}
