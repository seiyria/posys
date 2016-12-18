
import { Component } from '@angular/core';

@Component({
  selector: 'resume-transaction-button',
  template: `
    <button ion-button icon-left color="secondary" block>
      <ion-icon name="refresh"></ion-icon>
      Resume This Transaction
    </button>
`
})
export class ResumeTransactionButtonComponent {

  constructor() {}

}
