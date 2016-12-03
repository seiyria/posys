
import { Component } from '@angular/core';

@Component({
  selector: 'edit-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="create"></ion-icon>
      Edit
    </button>
`
})
export class EditButtonComponent {

  constructor() {}

}
