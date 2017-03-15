
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
  public hasAborted: boolean;

  public columns = [
    { name: 'Name',         column: 'name',                     alias: 'Name',          shouldUse: true,  disable: true,
      format: (x) => x },
    { name: 'SKU',          column: 'sku',                      alias: 'SKU',           shouldUse: true,  disable: true,
      format: (x) => x },
    { name: 'Description',  column: 'description',              alias: 'Description',   shouldUse: false,
      format: (x) => x },
    { name: 'Category',     column: 'organizationalunit.name',  alias: 'Category',      shouldUse: true,
      format: (x) => x },
    { name: 'Taxable',      column: 'taxable',                  alias: 'Taxable',       shouldUse: true,
      format: (x) => +x },
    { name: 'Cost',         column: 'cost',                     alias: 'Cost',          shouldUse: true,  disable: true,
      format: (x) => +x },
    { name: 'Quantity',     column: 'quantity',                 alias: 'Quantity',      shouldUse: true,  disable: true,
      format: (x) => +x }
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

  currentFile() {
    const files = document.getElementById('inventory-upload');
    if(!files) { return; }
    const file = (<HTMLInputElement>files).files[0];
    return file;
  }

  doImport() {
    const file = this.currentFile();
    if(!file) { return; }

    const reformatItem = (item): StockItem => {
      const obj = { sku: '', name: '', quantity: 0, cost: 0, taxable: false };
      _.each(this.columns, col => {
        if(!col.shouldUse) { return; }
        _.set(obj, col.column, col.format(_.get(item, col.alias)));
      });
      return new StockItem(obj);
    };

    const allItems = [];
    let abort = false;

    Papa.parse(file, {
      header: true,
      // worker: true,
      skipEmptyLines: true,
      step: (results) => {
        const item: StockItem = reformatItem(results.data[0]);
        if(!item.name || !item.sku || item.cost <= 0 || item.quantity < 0) {
          abort = true;
          return;
        }
        allItems.push(item);
      },
      complete: () => {
        if(abort) {
          this.hasAborted = true;
          return;
        }

        this.hasAborted = false;

        this.ivService
          .import(allItems)
          .toPromise()
          .then(() => {
            this.dismiss();
          });
      }
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
