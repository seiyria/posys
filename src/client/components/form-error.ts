
import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-error',
  template: `
    <ion-note *ngIf="errorObj[key]">{{ errorObj[key][0] }}</ion-note>
`,
  styles: [`
  ion-note {
    color: #f53d3d !important;
  }
`
  ]
})
export class FormErrorComponent {
  @Input() errorObj: any;
  @Input() key: string;

  constructor() {}

}
