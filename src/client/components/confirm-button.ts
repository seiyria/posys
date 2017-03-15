
import { Component, Input } from '@angular/core';

@Component({
  selector: 'confirm-button',
  template: `
    <button ion-button icon-left [disabled]="disabled">
      <ion-icon name="checkmark"></ion-icon>
      Confirm
    </button>
`
})
export class ConfirmButtonComponent {

  @Input() disabled: boolean;

  constructor() {}

}
