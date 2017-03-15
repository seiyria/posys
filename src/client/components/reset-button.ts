
import { Component } from '@angular/core';

@Component({
  selector: 'reset-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="undo"></ion-icon>
      Reset
    </button>
`
})
export class ResetButtonComponent {

  constructor() {}

}
