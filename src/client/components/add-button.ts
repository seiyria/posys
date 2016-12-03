
import { Component } from '@angular/core';

@Component({
  selector: 'add-button',
  template: `
    <button ion-button icon-left>
      <ion-icon name="add"></ion-icon>
      Add
    </button>
`
})
export class AddButtonComponent {

  constructor() {}

}
