
import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, Renderer, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'invoice-search',
  providers: [InvoiceService],
  template: `
    <form (submit)="doSearch()">
      <ion-searchbar [(ngModel)]="searchQuery"
                     [ngModelOptions]="{standalone: true}"
                     [showCancelButton]="true"
                     placeholder="Load invoice"
                     animated="true"
                     debounce="0"
                     (ionCancel)="cancelSearch()"
                     (ionInput)="handleIonChange($event)"></ion-searchbar>
    </form>
`,
})
export class InvoiceSearchComponent implements OnInit, OnDestroy {
  private globalListenKeypressRemover: Function;
  private inputElement: any;
  public searchQuery: string = '';

  @Output() searchResult = new EventEmitter();

  @Input() autofocus: boolean;
  @Input() ignoreModalInput: boolean;
  @Input() cancelWatcher: EventEmitter<any>;

  constructor(private invoiceService: InvoiceService,
              private alertCtrl: AlertController,
              private element: ElementRef,
              private renderer: Renderer) {}

  ngOnInit() {
    this.inputElement = this.element.nativeElement.querySelector('ion-searchbar input');

    if(this.autofocus) {
      this.inputElement.focus();
    }

    this.globalListenKeypressRemover = this.renderer.listenGlobal('document', 'keypress', ($event) => {
      if(this.ignoreModalInput && this.checkIfModalOnPage()) {
        return;
      }

      // don't hijack other inputs that might be visible
      if($event.srcElement && _.includes(['text', 'number', 'textarea', 'search'], $event.srcElement.type)) {
        return;
      }

      $event.global = true;
      this.handleQuery($event);
    });

    if(this.cancelWatcher) {
      this.cancelWatcher.subscribe(() => {
        this.cancelSearch();
      });
    }
  }

  doSearch() {
    this._itemSearch(this.searchQuery);
  }

  showNoInvoiceAvailableAlert() {
    const alert = this.alertCtrl.create({
      title: 'No Available Invoice',
      subTitle: 'No invoice with that id exists.',
      buttons: ['OK']
    });
    alert.present();
  }

  handleIonChange($event: any) {
    this.handleQuery($event);
  }

  handleQuery($event: any) {
    if(_.isString($event)) {
      this.searchQuery = $event;

    // prevent multi-character keys from being added
    } else if($event.global && $event.key.length === 1) {
      this.searchQuery += $event.key;

      // don't bubble up to the global event if it's already been processed
      $event.stopPropagation();
      $event.preventDefault();

    } else if($event.key === 'Enter') {
      this.doSearch();

    } else if($event.key === 'Escape' || this.searchQuery === '') {
      this.cancelSearch();

    }
  }

  checkIfModalOnPage(): boolean {
    const nodes = document.getElementsByTagName('ion-modal');
    const alertNodes = document.getElementsByTagName('ion-alert');
    return nodes.length > 0 || alertNodes.length > 0;
  }

  ngOnDestroy() {
    this.globalListenKeypressRemover();
  }

  _itemSearch(query: string): void {
    if(_.isNaN(+query)) {
      this.showNoInvoiceAvailableAlert();
      return;
    }

    this.invoiceService
      .get({ id: +query })
      .toPromise()
      .then(invoice => {
        if(!invoice) {
          this.showNoInvoiceAvailableAlert();
        } else {
          this.searchResult.emit(invoice);
          this.cancelSearch();
        }
      });
  }

  cancelSearch(): void {
    this.searchQuery = '';
    this.inputElement.value = '';
    this.searchResult.emit(null);
  }
}
