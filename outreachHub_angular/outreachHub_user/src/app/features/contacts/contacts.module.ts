import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactListComponent } from './pages/contact-list/contact-list.component';
import { ContactFormComponent } from './pages/contact-form/contact-form.component';


@NgModule({
  declarations: [
    ContactListComponent,
    ContactFormComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ContactsModule { }
