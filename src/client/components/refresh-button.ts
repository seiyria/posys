
import { Component } from '@angular/core';

@Component({
  selector: 'refresh-button',
  template: `
    <button ion-button icon-left color="secondary">
      <ion-icon name="refresh"></ion-icon>
      Refresh
    </button>
`
})
export class RefreshButtonComponent {

  constructor() {}

}
