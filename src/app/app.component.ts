import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';


import { addIcons } from 'ionicons';

import { personCircleOutline, create, person, homeOutline, alarmOutline, newspaperOutline, refresh } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({ personCircleOutline, create, person, homeOutline, alarmOutline, newspaperOutline, refresh });
  }
}