import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyAppComponent } from './app.component';
import { AboutPageComponent } from '../pages/about/about';
import { ContactPageComponent } from '../pages/contact/contact';
import { HomePageComponent } from '../pages/home/home';
import { TabsPageComponent } from '../pages/tabs/tabs';

@NgModule({
  declarations: [
    MyAppComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    TabsPageComponent
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
    TabsPageComponent
  ],
  providers: []
})
export class AppModule {}
