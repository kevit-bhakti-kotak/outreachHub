import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, SidebarComponent, AuthLayoutComponent, MainLayoutComponent],
  imports: [CommonModule,RouterModule],
  exports: [HeaderComponent, FooterComponent, SidebarComponent, CommonModule]
})
export class SharedModule {}
