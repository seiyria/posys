
import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, Renderer, OnInit, OnDestroy, ElementRef } from '@angular/core';

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
                   debounce="400"
                   (ionCancel)="cancelSearch()"
                   (ngModelChange)="handleQuery($event)"></ion-searchbar>
`,
})
export class OmnisearchComponent implements OnInit, OnDestroy {
  private searchItems: StockItem[] = [];
  private globalListenKeypressRemover: Function;
  private inputElement: any;
  public searchQuery: string = '';

  @Output() searchResults = new EventEmitter();
  @Output() hasQuery = new EventEmitter();
  @Input() autofocus: boolean;
  @Input() ignoreModalInput: boolean;
  @Input() preventEnterClear: boolean;
  @Input() cancelWatcher: EventEmitter<any>;

  constructor(private itemService: StockItemService,
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

      this.handleQuery($event);
    });

    if(this.cancelWatcher) {
      this.cancelWatcher.subscribe(() => {
        this.cancelSearch();
      });
    }
  }

  handleQuery($event: any) {
    if($event.key === 'Enter') {
      this._itemSearch(this.searchQuery, true, (items) => {
        if(items.length > 1) { return; }

        if(!this.preventEnterClear) {
          this.cancelSearch();
        }
      });

      /* don't hijack other inputs that might be visible */
    } else if(!_.includes(['text', 'number', 'textarea'], $event.srcElement.type)) {
      this.searchQuery += $event.key;

      // don't bubble up to the global event if it's already been processed
      $event.stopPropagation();
      $event.preventDefault();
    }
  }

  checkIfModalOnPage(): boolean {
    const nodes = document.getElementsByTagName('ion-modal');
    return nodes.length > 0;
  }

  ngOnDestroy() {
    this.globalListenKeypressRemover();
  }

  itemSearch($event): void {
    this._itemSearch($event.target.value);
  }

  _itemSearch(query: string, force = false, callback?: Function): void {
    this.hasQuery.emit(this.showSearchResults());
    this.itemService
      .search(query)
      .toPromise()
      .then(items => {
        this.searchResults.emit({ items, force });
        if(callback) { callback(items); }
      });
  }

  cancelSearch(): void {
    this.searchQuery = '';
    this.inputElement.value = '';
    this.searchItems = [];
    this.hasQuery.emit(this.showSearchResults());
    this.searchResults.emit({ items: [] });
  }

  showSearchResults(): boolean {
    return !!this.searchQuery.trim();
  }
}
