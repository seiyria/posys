import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';
import { InventoryPageComponent } from '../pages/inventory/inventory';
import { InventoryManagerComponent } from '../pages/inventory/inventoryManagement/inventoryManager';
import { AboutComponent } from '../pages/settings/about/about';
import { SettingsPageComponent } from '../pages/settings/settings';
import { PointOfSaleComponent } from '../pages/pointofsale/pointofsale';

import { TopIconButtonComponent } from '../components/top-icon-button';
import { OmnisearchComponent } from '../components/omnisearch';
import { TransactionItemComponent } from '../pages/pointofsale/transactionitem';
import { QueryItemComponent } from '../pages/pointofsale/queryitem';

import { LoggerService } from '../services/logger.service';
import { StockItemService } from '../models/stockitem.service';

@NgModule({
  declarations: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    SettingsPageComponent,
    AboutComponent,
    PointOfSaleComponent,

    TopIconButtonComponent,
    OmnisearchComponent,
    TransactionItemComponent,
    QueryItemComponent
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
    SettingsPageComponent,
    AboutComponent,
    PointOfSaleComponent
  ],
  providers: [
    LoggerService,
    StockItemService
  ]
})
export class AppModule {}
