
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { AlertController } from 'ionic-angular';

@Component({
  selector: 'update-quantity-button',
  template: `
    <button ion-button small color="secondary" (click)="updateQuantity()" [disabled]="disabled">
      {{ quantity }}
    </button>
`
})
export class UpdateQuantityButtonComponent {

  @Input() quantity: number;
  @Input() disabled: boolean;
  @Output() quantityChange = new EventEmitter();

  constructor(public alertCtrl: AlertController) {}

  updateQuantity() {
    let alert = this.alertCtrl.create({
      title: 'Update Quantity',
      inputs: [
        {
          name: 'quantity',
          type: 'number',
          placeholder: 'New Quantity',
          value: '' + this.quantity
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            this.quantityChange.emit(+data.quantity);
          }
        }
      ]
    });
    alert.present();
  }

}
