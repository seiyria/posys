
import { Component } from '@angular/core';

@Component({
  selector: 'manage-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="build"></ion-icon>
      Manage
    </button>
`
})
export class ManageButtonComponent {

  constructor() {}

}
