
import { Component, Input } from '@angular/core';

@Component({
  selector: 'my-top-icon-button',
  template: `
    <button ion-button outline block round top-icon color="dark">
      <ion-grid>
        <ion-row>
          <ion-col><ion-icon name="{{ icon }}"></ion-icon></ion-col>
        </ion-row>
        <ion-row>
          <div class="full-width">{{ text }}</div>
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
      padding-top: 30px;
      padding-bottom: 30px;
    }
    
    button[top-icon] .full-width {
      width: 100%;
      padding: 10px;
    }
`
  ]
})
export class TopIconButtonComponent {
  @Input() text = '';
  @Input() icon = '';

  constructor() {}

}
