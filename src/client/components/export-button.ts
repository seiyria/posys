
import { Component, Input } from '@angular/core';

@Component({
  selector: 'export-button',
  template: `
    <button ion-button icon-left [disabled]="disabled">
      <ion-icon name="log-out"></ion-icon>
      Export
    </button>
`
})
export class ExportButtonComponent {

  @Input() disabled: boolean;

  constructor() {}

}
