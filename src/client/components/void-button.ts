
import { Component, Input } from '@angular/core';

import { Invoice } from '../models/invoice';

@Component({
  selector: 'void-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="contrast"></ion-icon>
      {{ item.isVoided ? 'Un-void' : 'Void' }}
    </button>
`
})
export class VoidButtonComponent {

  @Input() item: Invoice;

  constructor() {}

}
