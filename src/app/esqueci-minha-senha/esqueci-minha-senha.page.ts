import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonToolbar, IonImg, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class EsqueciMinhaSenhaPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
