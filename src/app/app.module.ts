import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyAppComponent } from './app.component';
import { HomePageComponent } from '../pages/home/home';

import { TopIconButtonComponent } from '../components/top-icon-button';

@NgModule({
  declarations: [
    MyAppComponent,
    HomePageComponent,

    TopIconButtonComponent
  ],
  imports: [
    IonicModule.forRoot(MyAppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyAppComponent,
    HomePageComponent
  ],
  providers: []
})
export class AppModule {}
