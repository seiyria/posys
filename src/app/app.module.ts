import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyAppComponent } from './app.component';
import { AboutPageComponent } from '../pages/about/about';
import { ContactPageComponent } from '../pages/contact/contact';
import { HomePageComponent } from '../pages/home/home';
import { TabsPageComponent } from '../pages/tabs/tabs';
import { InventoryPageComponent } from '../pages/inventory/inventory';
import { InventoryManagerComponent } from '../pages/inventory/inventoryManagement/inventoryManager';

import { TopIconButtonComponent } from '../components/top-icon-button';

@NgModule({
  declarations: [
    MyAppComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    TabsPageComponent,
    InventoryPageComponent,
    InventoryManagerComponent,

    TopIconButtonComponent
  ],
  imports: [
    IonicModule.forRoot(MyAppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    TabsPageComponent,
    InventoryPageComponent,
    InventoryManagerComponent
  ],
  providers: []
})
export class AppModule {}
