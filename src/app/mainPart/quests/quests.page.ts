import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonImg, IonCard } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albumsOutline, checkmarkCircleOutline } from 'ionicons/icons';
import { RealtimeDatabaseService } from 'src/app/firebase/realtime-database';

interface Quest {
  challengeName: string;
  alarmName: string;
  points: number;
  challenges: string;
}

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
  standalone: true,

  imports: [ IonCard, IonImg, IonText, IonContent, CommonModule, FormsModule]
})
export class QuestsPage implements OnInit {

  constructor(
    public rt: RealtimeDatabaseService,
  ) {
    addIcons({ albumsOutline, checkmarkCircleOutline });
  }

  public dados: Array<any> = [];


  public score: number = 1000;
  
  public quests: Quest[] = [];
  

  // load() {
  //   this.rt.query('/missoes', (snapshot: any) => {
  //     if (snapshot.val() !== null) {
  //       this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
  //         // Garante que tenha missoes como array
  //         const missoes = Array.isArray(item.missoes) ? item.missoes : [];

  //         // Transforma cada missão em um objeto Quest
          // this.quests = missoes.map((m: any) => ({
          //   challengeName: m.titulo,
          //   alarmName: `Alarme ${item.idAlarme}`, // ou buscar de outro lugar, se tiver nome real
          //   points: m.pontos,
          //   challenges: m.descricao
          // }));
          
  //         this.telaVazia(item);
  //         return item;
  //       }).filter((item: any) => item != null);
  //     }else{
  //       this.dados = [];
  //     }
  //   })
  // }

  load() {
  this.rt.query('/alarme', (snapshotAlarme: any) => {
    const alarmes = snapshotAlarme.val() || {};

    this.rt.query('/missoes', (snapshot: any) => {
      if (snapshot.val() !== null) {
        this.dados = Object.entries(snapshot.val()).reduce((acc: any[], [key, item]: [string, any]) => {
          const missoesArr = Array.isArray(item.missoes) ? item.missoes : [];

          const alarmName = alarmes[item.idAlarme]?.nomeAlarme || `Alarme ${item.idAlarme}`;

          const quests: Quest[] = missoesArr.map((m: any) => ({
            challengeName: m.titulo,
            alarmName: alarmName,
            points: m.pontos,
            challenges: m.descricao
          }));

          // adiciona no array geral
          this.quests.push(...quests);

          this.telaVazia(item);

          return [...acc, item]; // acumula o item também
        }, []); // inicializa como array vazio
      } else {
        this.dados = [];
      }
    });
  });
}



  

  ngOnInit() {
    this.load()
  }

  // Começa como false para mostrar a tela "vazia".
  public hasQuests = signal<boolean>(false);
  // Mostra uma mensagem na tela caso não tenha nenhuma missão
  telaVazia(alarmes:any){
    if(alarmes.length == 0){
      // Para ver o design, mudar o valor abaixo pra 'true'
      this.hasQuests.set(false); 
    }else this.hasQuests.set(true); 
  }
}
