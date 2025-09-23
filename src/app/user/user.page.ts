import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonImg, IonLabel, IonItem, IonButton, IonIcon, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  imports: [IonText, IonIcon, IonButton, IonItem, IonLabel, IonImg, IonCard, IonContent, CommonModule, FormsModule]
})
export class UserPage implements OnInit {
  public perfil: string = 'perfil';
  public pontos: string = '1000'
  public amigos: string = 'amigos'
  public descricao: string = 'descricao...'

  constructor() { }

  ngOnInit() {
  }

}
