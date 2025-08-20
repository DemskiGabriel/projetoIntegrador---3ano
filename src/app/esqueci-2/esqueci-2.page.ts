import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonInputOtp, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-esqueci-2',
  templateUrl: './esqueci-2.page.html',
  styleUrls: ['./esqueci-2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonInputOtp, IonToolbar, IonImg, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class Esqueci2Page implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
