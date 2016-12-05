
import { Component, Input } from '@angular/core';

@Component({
  selector: 'import-button',
  template: `
    <button ion-button icon-left [disabled]="disabled">
      <ion-icon name="add"></ion-icon>
      Import
    </button>
`
})
export class ImportButtonComponent {

  @Input() disabled: boolean;

  constructor() {}

}
