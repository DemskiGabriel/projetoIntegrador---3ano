import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

// Icons
import { addIcons } from 'ionicons';
import { personCircleOutline, homeOutline, alarmOutline, newspaperOutline, refresh, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
//     icons
    addIcons({ personCircleOutline, homeOutline, alarmOutline, newspaperOutline, refresh, calendarOutline});
  }
}