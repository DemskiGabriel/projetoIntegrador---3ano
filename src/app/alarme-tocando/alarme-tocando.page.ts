import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFabButton, IonFab, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-alarme-tocando',
  templateUrl: './alarme-tocando.page.html',
  styleUrls: ['./alarme-tocando.page.scss'],
  standalone: true,
  imports: [IonButton, IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AlarmeTocandoPage implements OnInit {

  public desafio:string = 'BEBER ÁGUA';
  public horario:string = '20:00';
  public dia:string = 'QUIN, 08 OCT.';


  constructor() { }

  ngOnInit() {
  }

}
