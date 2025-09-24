import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RealtimeDatabaseService } from '../../firebase/realtime-database';

import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonNote,
  IonToggle,
  IonFab,
  IonFabButton,
  IonIcon, 
  IonText, 
  IonImg 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-alarms',
  templateUrl: './alarms.page.html',
  styleUrls: ['./alarms.page.scss'],
  standalone: true,

  imports: [ 
    IonImg, 
    IonText, 
    CommonModule,
    FormsModule,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonToggle,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink
  ]
})


export class AlarmsPage implements OnInit {
  public dados: Array<any> = [];

  constructor(
    public rt: RealtimeDatabaseService,
  ) {
    addIcons({ addOutline });
  }
  ngOnInit() {}
  
  ionViewWillEnter(){
    this.load();
  }

  load() {
    this.rt.query('/alarme', (snapshot: any) => {
      if (snapshot.val() !== null) {
        this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
          item.id = key;
          item.alarmes = Array.isArray(item.alarmes) ? item.alarmes : [];
  
          // faz com que a apareceça o horario mais proximo.
          item.proximoAlarme = this.getProximoAlarme(item);

          this.telaVazia(item);
          return item;
        }).filter((item: any) => item != null);
      }else{
        this.dados = [];
      }
    })
  }

  getProximoAlarme(item: any): string | null {
    if (!item.alarmes || item.alarmes.length === 0) return null;
  
    const agora = new Date();
  
    const proximo = item.alarmes.find((a: any) => {
      if (!a.ativo) return false;
  
      const [h, m] = a.hora.split(':').map(Number);
      const horaAlarme = new Date();
      horaAlarme.setHours(h, m, 0, 0);
  
      return horaAlarme.getTime() > agora.getTime();
    });
  
    return proximo ? proximo.hora : null;
  }

  toggleContent() {
    this.hasAlarms.update(value => !value);
  }

  toggleAlarm(index: number) {
    this.dados[index].ativo = !this.dados[index].ativo;
  }

  public hasAlarms = signal<boolean>(false);
  telaVazia(alarmes:any){
    if(alarmes.length == 0){
      // Para ver o design, mudar o valor abaixo pra 'true'
      this.hasAlarms.set(false); 
    }else this.hasAlarms.set(true); 
  }
}