import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonIcon, IonFab, IonFabButton, IonList, IonItem, IonImg, IonLabel, IonButton, IonContent } from '@ionic/angular/standalone';

import '@ionic/core/css/core.css';

import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonList, IonFab, IonFabButton, IonIcon, IonCard, IonItem, IonLabel, IonImg, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
