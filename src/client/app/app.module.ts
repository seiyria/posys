import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Ng2Webstorage } from 'ng2-webstorage';

import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';
import { InventoryPageComponent } from '../pages/inventory/inventory';
import { InventoryManagerComponent } from '../pages/inventory/management/inventory.management';
import { OUManagerComponent } from '../pages/inventory/oumanage/ou.management';
import { QuickComponent } from '../pages/inventory/quick/quick';

import { AboutComponent } from '../pages/settings/about/about';
import { SettingsPageComponent } from '../pages/settings/settings';
import { PointOfSalePageComponent } from '../pages/pointofsale/pointofsale';
import { InvoicesPageComponent } from '../pages/invoices/invoices';
import { PromotionsPageComponent } from '../pages/promotions/promotions';
import { ReportingPageComponent } from '../pages/reporting/reporting';

import { FormErrorComponent } from '../components/form-error';
import { TopIconButtonComponent } from '../components/top-icon-button';
import { OmnisearchComponent } from '../components/omni-search';

import { AddButtonComponent } from '../components/add-button';
import { EditButtonComponent } from '../components/edit-button';
import { ResetButtonComponent } from '../components/reset-button';
import { ImportButtonComponent } from '../components/import-button';
import { RemoveButtonComponent } from '../components/remove-button';
import { UpdateButtonComponent } from '../components/update-button';

import { TransactionItemComponent } from '../pages/pointofsale/transactionitem';
import { QueryItemComponent } from '../pages/pointofsale/queryitem';
import { InventoryItemComponent } from '../pages/inventory/inventoryitem';

import { ApplicationSettingsService } from '../services/settings.service';
import { LoggerService } from '../services/logger.service';
import { StockItemService } from '../services/stockitem.service';
import { OrganizationalUnitService } from '../services/organizationalunit.service';

import { PaginationComponent } from 'ionic2-pagination';

import { CurrencyFromSettingsPipe } from '../pipes/currency-from-settings';
import { TruncatePipe } from '../pipes/truncate';

@NgModule({
  declarations: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    OUManagerComponent,
    QuickComponent,

    SettingsPageComponent,
    AboutComponent,
    PointOfSalePageComponent,
    InvoicesPageComponent,
    PromotionsPageComponent,
    ReportingPageComponent,

    FormErrorComponent,
    TopIconButtonComponent,
    OmnisearchComponent,
    TransactionItemComponent,
    InventoryItemComponent,
    QueryItemComponent,

    AddButtonComponent,
    EditButtonComponent,
    ResetButtonComponent,
    ImportButtonComponent,
    RemoveButtonComponent,
    UpdateButtonComponent,

    PaginationComponent,

    CurrencyFromSettingsPipe,
    TruncatePipe
  ],
  imports: [
    Ng2Webstorage,
    IonicModule.forRoot(MyAppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    OUManagerComponent,
    QuickComponent,
    SettingsPageComponent,
    AboutComponent,
    PointOfSalePageComponent,
    InvoicesPageComponent,
    PromotionsPageComponent,
    ReportingPageComponent
  ],
  providers: [
    ApplicationSettingsService,
    LoggerService,
    StockItemService,
    OrganizationalUnitService,
    CurrencyPipe
  ]
})
export class AppModule {}
