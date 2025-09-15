import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonInput, IonButton, IonButtons, IonAvatar, IonItem, IonIcon, IonLabel, IonFab, IonFabButton} from '@ionic/angular/standalone';

@Component({
  selector: 'app-changeprofile',
  templateUrl: './changeprofile.page.html',
  styleUrls: ['./changeprofile.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardContent, IonInput, IonButton, IonButtons, IonAvatar, IonItem, IonIcon, IonLabel, IonFab, IonFabButton]
})
export class ChangeprofilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
}
