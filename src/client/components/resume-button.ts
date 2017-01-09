
import { Component, Input } from '@angular/core';

@Component({
  selector: 'resume-transaction-button',
  template: `
    <button ion-button icon-left color="secondary" block>
      <ion-icon name="refresh"></ion-icon>
      {{ isReturn ? 'Return Items' : 'Resume This Transaction' }}
    </button>
`
})
export class ResumeTransactionButtonComponent {

  @Input() isReturn: boolean;

  constructor() {}

}
