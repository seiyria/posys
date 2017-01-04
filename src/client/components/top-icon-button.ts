
import { Component, Input, Output, EventEmitter } from '@angular/core';

type iconSize = 'large' | 'medium';

@Component({
  selector: 'top-icon-button',
  template: `
    <button ion-button 
            outline 
            block 
            round 
            top-icon 
            color="dark" 
            [disabled]="disabled" 
            (click)="subClick.next($event)" 
            [class.medium-size]="size === 'medium'">
      <ion-grid>
        <ion-row>
          <ion-col class="icon-{{size}}"><ion-icon name="{{ icon }}"></ion-icon></ion-col>
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
      min-height: 200px;
    }
    
    button[top-icon].medium-size {
      min-height: 150px;
    }
  
    button[top-icon] .icon-large .icon {
      font-size: 70px;
      padding-top: 30px;
      padding-bottom: 30px;
    }
  
    button[top-icon] .icon-medium .icon {
      font-size: 50px;
      padding-top: 15px;
      padding-bottom: 15px;
    }
    
    button[top-icon] .full-width {
      width: 100%;
      padding: 10px;
      white-space: normal;
    }
`
  ]
})
export class TopIconButtonComponent {
  @Input() text: string = '';
  @Input() icon: string = '';
  @Input() size: iconSize = 'large';
  @Input() disabled: boolean = false;
  @Output() subClick = new EventEmitter();

  constructor() {}

}
