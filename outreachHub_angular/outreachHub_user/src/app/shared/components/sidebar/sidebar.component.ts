import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() isOpen = true;
  @Output() isOpenChange = new EventEmitter<boolean>();

  mobileOpen = false;

  menuItems = [
    { name: 'Home', link: '/home' },
    { name: 'Contacts', link: '/contacts' },
    { name: 'Message-templates', link: '/message-templates' },
    { name: 'Campaigns', link: '/campaigns' },
  ];

  onToggle() {
    this.isOpen = !this.isOpen;
    this.isOpenChange.emit(this.isOpen); // notify parent (MainLayout)
  }
}
