import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audience-modal',
  templateUrl: './audience-modal.component.html',
})
export class AudienceModalComponent {
  @Input() open = false;
  @Input() contacts: any[] = [];
  @Output() close = new EventEmitter<void>();

  handleClose() {
    this.close.emit();
  }
}
