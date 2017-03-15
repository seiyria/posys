
import { Component } from '@angular/core';

@Component({
  selector: 'view-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="open"></ion-icon>
      View
    </button>
`
})
export class ViewButtonComponent {

  constructor() {}

}
