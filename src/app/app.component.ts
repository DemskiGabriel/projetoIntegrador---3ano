import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

// Icons
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, 
  homeOutline, 
  alarmOutline, 
  newspaperOutline, 
  refresh, 
  calendarOutline, 
  arrowBackOutline, 
  pencilOutline, 
  create, 
  person, 
  addOutline, 
  timeOutline,
  checkmark
} from 'ionicons/icons';
import { TimeCheckerService } from './services/time-checker';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private timeCheckerService: TimeCheckerService
  ) {
//  icons
    addIcons({ 
      personCircleOutline, 
      homeOutline, 
      alarmOutline, 
      newspaperOutline, 
      refresh, 
      calendarOutline, 
      arrowBackOutline, 
      pencilOutline, 
      create, 
      person, 
      addOutline, 
      timeOutline,
      checkmark
    });

    // Isso garante que o serviço seja instanciado assim que o app iniciar
    console.log('TimeCheckerService iniciado globalmente.');
  }
}