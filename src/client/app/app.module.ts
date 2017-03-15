import { NgModule, ErrorHandler } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { IonicApp, IonicModule } from 'ionic-angular';
import { Ng2Webstorage } from 'ng2-webstorage';

import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';

import { InventoryPageComponent } from '../pages/inventory/inventory';
import { InventoryMassManagementComponent } from '../pages/inventory/ivmanage/ivmanage';
import { InventoryManagerComponent } from '../pages/inventory/management/inventory.management';
import { OUManagerComponent } from '../pages/inventory/oumanage/ou.management';
import { QuickComponent } from '../pages/inventory/quick/quick';

import { AboutComponent } from '../pages/settings/about/about';
import { AuditPageComponent } from '../pages/settings/audit/audit';
import { ErrorPageComponent } from '../pages/settings/error/error';
import { EditSettingsComponent } from '../pages/settings/edit/editsettings';
import { SettingsPageComponent } from '../pages/settings/settings';
import { LocationManagerComponent } from '../pages/settings/locationmanage/location.management';

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
import { InvoiceSearchComponent } from '../components/invoice-search';

import { AddButtonComponent } from '../components/add-button';
import { ConfirmButtonComponent } from '../components/confirm-button';
import { EditButtonComponent } from '../components/edit-button';
import { ExportButtonComponent } from '../components/export-button';
import { ResetButtonComponent } from '../components/reset-button';
import { ImportButtonComponent } from '../components/import-button';
import { ManageButtonComponent } from '../components/manage-button';
import { PrintButtonComponent } from '../components/print-button';
import { RefreshButtonComponent } from '../components/refresh-button';
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
import { AuditItemComponent } from '../pages/settings/audit/audititem';
import { ErrorItemComponent } from '../pages/settings/error/erroritem';

import { ApplicationSettingsService } from '../services/settings.service';
import { AuditService } from '../services/audit.service';
import { ErrorService } from '../services/error.service';
import { LoggerService } from '../services/logger.service';
import { PromotionService } from '../services/promotion.service';
import { StockItemService } from '../services/stockitem.service';
import { InvoiceService } from '../services/invoice.service';
import { InventoryService } from '../services/inventory.service';
import { LocationService } from '../services/location.service';
import { OrganizationalUnitService } from '../services/organizationalunit.service';
import { ReportService } from '../services/report.service';

import { HttpClient } from '../services/override/http.custom';
import { CustomErrorHandler } from '../services/override/error.custom';

import { PaginationComponent } from 'ionic2-pagination';

import { CurrencyFromSettingsPipe } from '../pipes/currency-from-settings';
import { TruncatePipe } from '../pipes/truncate';

@NgModule({
  declarations: [
    MyAppComponent,
    HomePageComponent,
    InventoryPageComponent,
    InventoryMassManagementComponent,
    InventoryManagerComponent,
    OUManagerComponent,
    QuickComponent,

    SettingsPageComponent,
    AuditPageComponent,
    ErrorPageComponent,
    EditSettingsComponent,
    AboutComponent,
    LocationManagerComponent,

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
    InvoiceSearchComponent,
    TransactionItemComponent,
    TransactionItemPopoverComponent,
    TransactionPromoComponent,
    TransactionPromoPopoverComponent,
    InventoryItemComponent,
    PromotionDisplayComponent,
    QueryItemComponent,
    InvoiceItemComponent,
    AuditItemComponent,
    ErrorItemComponent,

    AddButtonComponent,
    ConfirmButtonComponent,
    EditButtonComponent,
    ExportButtonComponent,
    RefreshButtonComponent,
    ResetButtonComponent,
    ImportButtonComponent,
    ManageButtonComponent,
    PrintButtonComponent,
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
    InventoryMassManagementComponent,
    InventoryManagerComponent,
    OUManagerComponent,
    QuickComponent,
    SettingsPageComponent,
    AuditPageComponent,
    ErrorPageComponent,
    EditSettingsComponent,
    LocationManagerComponent,
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
    AuditService,
    ErrorService,
    LoggerService,
    StockItemService,
    PromotionService,
    InvoiceService,
    InventoryService,
    LocationService,
    OrganizationalUnitService,
    ReportService,
    CurrencyPipe,
    HttpClient,
    { provide: ErrorHandler, useClass: CustomErrorHandler }
  ]
})
export class AppModule {}
