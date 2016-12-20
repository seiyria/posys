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
import { EditSettingsComponent } from '../pages/settings/edit/editsettings';
import { SettingsPageComponent } from '../pages/settings/settings';

import { PointOfSalePageComponent } from '../pages/pointofsale/pointofsale';
import { CashPayComponent } from '../pages/pointofsale/cashpay/pointofsale.cashpay';

import { InvoicesPageComponent } from '../pages/invoices/invoices';
import { InvoiceViewComponent } from '../pages/invoices/view/invoice.view';

import { PromotionsPageComponent } from '../pages/promotions/promotions';
import { PromotionsManagerComponent } from '../pages/promotions/management/promotions.management';

import { ReportingPageComponent } from '../pages/reporting/reporting';

import { FormErrorComponent } from '../components/form-error';
import { TopIconButtonComponent } from '../components/top-icon-button';
import { OmnisearchComponent, OmnisearchWindowComponent, QueryItemComponent } from '../components/omni-search';

import { AddButtonComponent } from '../components/add-button';
import { ConfirmButtonComponent } from '../components/confirm-button';
import { EditButtonComponent } from '../components/edit-button';
import { ExportButtonComponent } from '../components/export-button';
import { ResetButtonComponent } from '../components/reset-button';
import { ImportButtonComponent } from '../components/import-button';
import { RemoveButtonComponent } from '../components/remove-button';
import { ResumeTransactionButtonComponent } from '../components/resume-button';
import { UpdateButtonComponent } from '../components/update-button';
import { UpdateQuantityButtonComponent } from '../components/update-quantity-button';
import { ViewButtonComponent } from '../components/view-button';
import { VoidButtonComponent } from '../components/void-button';

import { TransactionItemComponent, TransactionItemPopoverComponent } from '../pages/pointofsale/transactionitem';
import { TransactionPromoComponent, TransactionPromoPopoverComponent } from '../pages/pointofsale/transactionpromo';
import { InventoryItemComponent } from '../pages/inventory/inventoryitem';
import { PromotionDisplayComponent } from '../pages/promotions/promotiondisplay';
import { InvoiceItemComponent } from '../pages/invoices/invoiceitem';

import { ApplicationSettingsService } from '../services/settings.service';
import { LoggerService } from '../services/logger.service';
import { PromotionService } from '../services/promotion.service';
import { StockItemService } from '../services/stockitem.service';
import { InvoiceService } from '../services/invoice.service';
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
    EditSettingsComponent,
    AboutComponent,
    PointOfSalePageComponent,
    CashPayComponent,
    InvoicesPageComponent,
    InvoiceViewComponent,
    PromotionsPageComponent,
    PromotionsManagerComponent,
    ReportingPageComponent,

    FormErrorComponent,
    TopIconButtonComponent,
    OmnisearchComponent,
    OmnisearchWindowComponent,
    TransactionItemComponent,
    TransactionItemPopoverComponent,
    TransactionPromoComponent,
    TransactionPromoPopoverComponent,
    InventoryItemComponent,
    PromotionDisplayComponent,
    QueryItemComponent,
    InvoiceItemComponent,

    AddButtonComponent,
    ConfirmButtonComponent,
    EditButtonComponent,
    ExportButtonComponent,
    ResetButtonComponent,
    ImportButtonComponent,
    RemoveButtonComponent,
    ResumeTransactionButtonComponent,
    UpdateButtonComponent,
    UpdateQuantityButtonComponent,
    ViewButtonComponent,
    VoidButtonComponent,

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
    OmnisearchWindowComponent,
    InventoryPageComponent,
    InventoryManagerComponent,
    OUManagerComponent,
    QuickComponent,
    SettingsPageComponent,
    EditSettingsComponent,
    AboutComponent,
    PointOfSalePageComponent,
    CashPayComponent,
    InvoicesPageComponent,
    InvoiceViewComponent,
    PromotionsPageComponent,
    PromotionsManagerComponent,
    ReportingPageComponent,

    TransactionItemPopoverComponent,
    TransactionPromoPopoverComponent
  ],
  providers: [
    ApplicationSettingsService,
    LoggerService,
    StockItemService,
    PromotionService,
    InvoiceService,
    OrganizationalUnitService,
    CurrencyPipe
  ]
})
export class AppModule {}
