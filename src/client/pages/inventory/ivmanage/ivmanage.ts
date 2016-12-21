
import * as _ from 'lodash';

import { Component, OnInit } from '@angular/core';
import { ViewController, NavParams } from 'ionic-angular';

import { StockItem } from '../../../models/stockitem';

import { InventoryService } from '../../../services/inventory.service';

const Papa = require('papaparse');
const { saveAs } = require('file-saver');

@Component({
  templateUrl: 'ivmanage.html'
})
export class InventoryMassManagementComponent implements OnInit {

  public mode: string;

  public columns = [
    { name: 'Name',         column: 'name',                     alias: 'Name',          shouldUse: true,
      format: (x) => x },
    { name: 'SKU',          column: 'sku',                      alias: 'SKU',           shouldUse: true,
      format: (x) => x },
    { name: 'Description',  column: 'description',              alias: 'Description',   shouldUse: false,
      format: (x) => x },
    { name: 'OU Name',      column: 'organizationalunit.name',  alias: 'OU',            shouldUse: true,
      format: (x) => x },
    { name: 'Taxable',      column: 'taxable',                  alias: 'Taxable',       shouldUse: true,
      format: (x) => +x },
    { name: 'Cost',         column: 'cost',                     alias: 'Cost',          shouldUse: true,
      format: (x) => x },
    { name: 'Quantity',     column: 'quantity',                 alias: 'Quantity',      shouldUse: true,
      format: (x) => x }
  ];

  constructor(public viewCtrl: ViewController,
              public navParams: NavParams,
              public ivService: InventoryService) {}

  ngOnInit() {
    this.mode = this.navParams.get('mode');
  }

  private getUseableColumns(): any[] {
    return _.map(_.filter(this.columns, col => col.shouldUse), 'column');
  }

  private transformObjects(objects: StockItem[]) {
    return _.map(objects, item => {
      const obj = {};
      _.each(this.columns, col => {
        if(!col.shouldUse) { return; }
        obj[col.alias] = col.format(_.get(item, col.column));
      });
      return obj;
    });
  }

  doExport() {
    this.ivService
      .export(this.getUseableColumns())
      .toPromise()
      .then(data => {
        const csvReady = this.transformObjects(data);
        const csv = Papa.unparse(csvReady);
        const blob = new Blob([csv], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, `inventory-${new Date()}.csv`);
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
