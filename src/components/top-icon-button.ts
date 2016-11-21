
import { Component, Input } from '@angular/core';

@Component({
  selector: 'top-icon-button',
  template: `
    <button ion-button outline block round top-icon>
      <ion-grid>
        <ion-row>
          <ion-col><ion-icon name="{{ icon }}"></ion-icon></ion-col>
        </ion-row>
        <ion-row center>
          <div text-center>{{ text }}</div>
        </ion-row>
      </ion-grid>
    </button>
`,
  styles: [`
    button[top-icon] {
      white-space: pre;
    }
  
    button[top-icon] .icon {
      font-size: 100px;
    }
`
  ]
})
export class TopIconButtonComponent {
  @Input() text = '';
  @Input() icon = '';

  constructor() {}

}
