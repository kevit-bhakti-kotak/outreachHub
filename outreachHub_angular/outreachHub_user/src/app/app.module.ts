import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,         // singletons, interceptors
    SharedModule,       // layouts + components
    AppRoutingModule,   // ✅ contains RouterModule.forRoot(routes)
    FormsModule,
    HttpClientModule,
    LucideAngularModule
    
  ],
  bootstrap: [AppComponent],
   providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
})
export class AppModule {}
