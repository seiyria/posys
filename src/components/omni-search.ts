
import { Component, Output, EventEmitter, Renderer, OnInit, OnDestroy } from '@angular/core';

import { StockItemService } from '../models/stockitem.service';
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
  private searchItems: StockItem[];
  private searchQuery: string = '';
  private globalListenKeypressRemover: Function;

  @Output() searchResults = new EventEmitter();
  @Output() hasQuery = new EventEmitter();

  constructor(private itemService: StockItemService, private renderer: Renderer) {}

  ngOnInit() {
    this.globalListenKeypressRemover = this.renderer.listenGlobal('document', 'keypress', ($event) => {
      if($event.key === 'Enter') {
        this._itemSearch(this.searchQuery, true);
        this.cancelSearch();
      } else if($event.srcElement.type !== 'search') {
        this.searchQuery += $event.key;
      }
    });
  }

  ngOnDestroy() {
    this.globalListenKeypressRemover();
  }

  itemSearch($event) {
    this._itemSearch($event.target.value);
  }

  _itemSearch(query: string, force = false) {
    this.hasQuery.emit(this.showSearchResults());
    this.searchResults.emit({ items: this.itemService.search(query), force });
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
