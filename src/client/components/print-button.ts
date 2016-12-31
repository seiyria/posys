
import { Component, Input } from '@angular/core';

@Component({
  selector: 'print-button',
  template: `
    <button ion-button icon-left color="secondary" block [disabled]="disabled">
      <ion-icon name="print"></ion-icon>
      Print
    </button>
`
})
export class PrintButtonComponent {

  @Input() disabled: boolean;

  constructor() {}

}
