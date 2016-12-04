
import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, Renderer, OnInit, OnDestroy } from '@angular/core';

import { StockItemService } from '../services/stockitem.service';
import { StockItem } from '../models/stockitem';

@Component({
  selector: 'omni-search',
  providers: [StockItemService],
  template: `
    <ion-searchbar [(ngModel)]="searchQuery"
                   [showCancelButton]="true"
                   placeholder="Search items"
                   animated="true"
                   (ionCancel)="cancelSearch()"
                   (ionInput)="itemSearch($event)"></ion-searchbar>
`,
})
export class OmnisearchComponent implements OnInit, OnDestroy {
  private searchItems: StockItem[] = [];
  private globalListenKeypressRemover: Function;
  public searchQuery: string = '';

  @Output() searchResults = new EventEmitter();
  @Output() hasQuery = new EventEmitter();
  @Input() cancelWatcher: EventEmitter<any>;

  constructor(private itemService: StockItemService, private renderer: Renderer) {}

  ngOnInit() {
    // TODO debounce this
    this.globalListenKeypressRemover = this.renderer.listenGlobal('document', 'keypress', ($event) => {
      if($event.key === 'Enter') {
        this._itemSearch(this.searchQuery, true, (items) => {
          if(items.length > 1) { return; }
          this.cancelSearch();
        });
      } else if(!_.includes(['search', 'text', 'number'], $event.srcElement.type)) {
        this.searchQuery += $event.key;
      }
    });

    if(this.cancelWatcher) {
      this.cancelWatcher.subscribe(() => {
        this.cancelSearch();
      });
    }
  }

  ngOnDestroy() {
    this.globalListenKeypressRemover();
  }

  itemSearch($event) {
    this._itemSearch($event.target.value);
  }

  _itemSearch(query: string, force = false, callback?: Function) {
    this.hasQuery.emit(this.showSearchResults());
    this.itemService
      .search(query)
      .toPromise()
      .then(items => {
        this.searchResults.emit({ items, force });
        if(callback) { callback(items); }
      });
  }

  cancelSearch() {
    this.searchQuery = '';
    this.searchItems = [];
    this.hasQuery.emit(this.showSearchResults());
    this.searchResults.emit({ items: [] });
  }

  showSearchResults() {
    return this.searchQuery.trim();
  }
}
