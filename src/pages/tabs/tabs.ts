import { Component } from '@angular/core';

import { HomePageComponent } from '../home/home';
import { AboutPageComponent } from '../about/about';
import { ContactPageComponent } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPageComponent {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = HomePageComponent;
  tab2Root: any = AboutPageComponent;
  tab3Root: any = ContactPageComponent;

  constructor() {

  }
}
