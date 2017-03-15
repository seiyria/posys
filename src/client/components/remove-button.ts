
import { Component } from '@angular/core';

@Component({
  selector: 'remove-button',
  template: `
    <button ion-button icon-left color="danger">
      <ion-icon name="trash"></ion-icon>
      Remove
    </button>
`
})
export class RemoveButtonComponent {

  constructor() {}

}
