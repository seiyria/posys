import { NgModule } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IonicApp, IonicModule } from 'ionic-angular';

import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';
import { InventoryPageComponent } from '../pages/inventory/inventory';
import { InventoryManagerComponent } from '../pages/inventory/management/inventory.management';
import { OUManagerComponent } from '../pages/inventory/oumanage/ou.management';
import { AboutComponent } from '../pages/settings/about/about';
import { SettingsPageComponent } from '../pages/settings/settings';
import { PointOfSalePageComponent } from '../pages/pointofsale/pointofsale';
import { InvoicesPageComponent } from '../pages/invoices/invoices';
import { PromotionsPageComponent } from '../pages/promotions/promotions';
import { ReportingPageComponent } from '../pages/reporting/reporting';

import { FormErrorComponent } from '../components/form-error';
import { TopIconButtonComponent } from '../components/top-icon-button';
import { OmnisearchComponent } from '../components/omni-search';
import { TransactionItemComponent } from '../pages/pointofsale/transactionitem';
import { QueryItemComponent } from '../pages/pointofsale/queryitem';

import { ApplicationSettingsService } from '../services/settings.service';
import { LoggerService } from '../services/logger.service';
import { StockItemService } from '../services/stockitem.service';
import { OrganizationalUnitService } from '../services/organizationalunit.service';

import { CurrencyFromSettingsPipe } from '../pipes/currency-from-settings';
import { TruncatePipe } from '../pipes/truncate';

@NgModule({
  declarations: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    OUManagerComponent,
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
    QueryItemComponent,

    CurrencyFromSettingsPipe,
    TruncatePipe
  ],
  imports: [
    IonicModule.forRoot(MyAppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    OUManagerComponent,
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
