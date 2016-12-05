
import * as _ from 'lodash';

import { Component, Input, Output, EventEmitter, Renderer, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { StockItemService } from '../services/stockitem.service';
import { StockItem } from '../models/stockitem';

@Component({
  selector: 'omni-search',
  providers: [StockItemService],
  template: `
    <form (submit)="doSearch()">
      <ion-searchbar [(ngModel)]="searchQuery"
                     [ngModelOptions]="{standalone: true}"
                     [showCancelButton]="true"
                     placeholder="Search items"
                     animated="true"
                     debounce="0"
                     (ionCancel)="cancelSearch()"
                     (ionInput)="handleIonChange($event)"></ion-searchbar>
    </form>
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
    this._itemSearch(this.searchQuery, true, (items) => {
      if(items.length > 1) { return; }

      if(!this.preventEnterClear) {
        this.cancelSearch();
      }
    });
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
    return nodes.length > 0;
  }

  ngOnDestroy() {
    this.globalListenKeypressRemover();
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
    this.hasQuery.emit(false);
    this.searchResults.emit({ items: [] });
  }

  showSearchResults(): boolean {
    return !!this.searchQuery.trim();
  }
}
