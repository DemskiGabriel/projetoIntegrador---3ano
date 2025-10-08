import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RealtimeDatabaseService } from '../../firebase/realtime-database';

import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonFab,
  IonFabButton,
  IonIcon, 
  IonText, 
  IonImg 
} from '@ionic/angular/standalone';
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
    IonToggle,
    IonFab,
    IonFabButton,
    IonIcon,
    RouterLink
  ]
})

export class AlarmsPage{
  public dados: Array<any> = [];

  constructor(
    public rt: RealtimeDatabaseService,
  ) {}
  
  ionViewWillEnter(){
    this.load();
  }
  

  // Id do usuario logado.
  public userId:string = localStorage.getItem('userId') || '';
  load() {
    this.rt.query('/alarme', (snapshot: any) => {
      if (snapshot.val() !== null) {
        this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
          item.id = key;
          item.alarmes = Array.isArray(item.alarmes) ? item.alarmes : [];
          
          // faz com que a apareceça o horario mais proximo.
          item.proximoAlarme = this.getProximoAlarme(item);

          return item;
        }).filter((item: any) => item.user === this.userId);
        this.telaVazia(this.dados);
      }else{
        this.dados = [];
      }
    })
  }

  getProximoAlarme(item: any): string | null {
    if (!item.alarmes || item.alarmes.length === 0) return null;
  
    const agora = new Date();
  
    // Tenta encontrar o próximo alarme ativo
    const proximo = item.alarmes.find((a: any) => {
      if (!a.ativo) return false;
  
      const [h, m] = a.hora.split(':').map(Number);
      const horaAlarme = new Date();
      horaAlarme.setHours(h, m, 0, 0);
  
      return horaAlarme.getTime() > agora.getTime();
    });
  
    if (proximo) {
      return proximo.hora;
    }
  
    // Se nenhum alarme está no futuro, retorna o primeiro alarme ativo da lista
    const primeiroAtivo = item.alarmes.find((a: any) => a.ativo);
    return primeiroAtivo ? primeiroAtivo.hora : null;
  }
  

  toggleContent() {
    this.hasAlarms.update(value => !value);
  }

  toggleAlarm(index: number) {
    this.dados[index].ativo = !this.dados[index].ativo;
    
    this.rt.add(`/alarme`, {
      // Id Do usuario.
      user: this.dados[index].user,
        
      nomeAlarme: this.dados[index].nomeAlarme,
      horarioInicio: this.dados[index].horarioInicio,
      horarioFinal: this.dados[index].horarioFinal,
      vezesPorDia: this.dados[index].vezesPorDia,
      vibracao: this.dados[index].vibracao,
      somAlarme: this.dados[index].somAlarme,

      // Dias se refere aos dias que o alarme sera desparado.
      dias: this.dados[index].dias,
      // Tipo Data referesse a se o tipo de dias é uma data do calendario ou são dias da semana.
      tipoData: this.dados[index].tipoData,
      // Alarmes referesse a lista de vezes que o alarme dispertara em um dia.
      alarmes: this.dados[index].alarmes,
      // Ativo referesse se o alarme esta ativo ou não.
      ativo: this.dados[index].ativo = !this.dados[index].ativo, 

      // Modo desafio(Caso ativo)
      modoDesafio: this.dados[index].modoDesafio,
      descricaoDesafio: this.dados[index].descricaoDesafio,
    }, index+1)
      .subscribe({
        next: (idDoAlarme) => {
          console.log("Alarme definido como " + (this.dados[index].ativo = !this.dados[index].ativo))
          console.log("Id Do Alarme: " + idDoAlarme);
        },
        error: (err) => console.log('Falhou ', err)
      });
  }

  public hasAlarms = signal<boolean>(false);
  telaVazia(alarmes:any){
    if(alarmes.length == 0){
      this.hasAlarms.set(false); 
    }else this.hasAlarms.set(true); 
  }
}