import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';


import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonImg,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon
} from '@ionic/angular/standalone';

import { home, add, person } from 'ionicons/icons';
import { addIcons } from 'ionicons';

addIcons({ home, add, person });

@Component({
  selector: 'app-no-missions',
  templateUrl: './semmissao.page.html',
  styleUrls: ['./semmissao.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonImg,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    IonIcon

  ]
})
export class SemmissaoPage implements OnInit {

  constructor() { }

  ngOnInit() {

  }

}