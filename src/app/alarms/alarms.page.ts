import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonToggle,
  IonFab,
  IonFabButton,
  IonIcon,
  IonButtons,
  IonButton,
  IonText,
  IonImg
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, albumsOutline } from 'ionicons/icons';

interface Alarm {
  title: string;
  time: string;
  image: string;
  enabled: boolean;
}

@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonNote,
    IonToggle,
    IonFab,
    IonFabButton,
    IonIcon,
    IonButtons,
    IonButton,
    IonText,
    IonImg
  ]
})
export class AlarmsPage implements OnInit {
  public hasAlarms = signal<boolean>(false);

  public alarms: Alarm[] = [
    {
      title: 'Tomar Água',
      time: '14:30',
      image: 'assets/imagens/copo.png',
      enabled: true
    },
    {
      title: 'Caminhar',
      time: '18:00',
      image: 'assets/imagens/run.png',
      enabled: false
    }
  ];

  constructor() {
    addIcons({ addOutline, albumsOutline });
  }

  ngOnInit() {
    // Para ver o design, mudar o valor abaixo pra 'true'
    this.hasAlarms.set(false);
  }

  toggleContent() {
    this.hasAlarms.update(value => !value);
  }

  toggleAlarm(index: number) {
    if (this.alarms[index]) {
      this.alarms[index].enabled = !this.alarms[index].enabled;
    }
  }
}
