import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonText, 
  IonImg, 
  IonItem
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons'; 
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
  imports: [ 
    IonImg, IonText, IonContent, IonItem,
    CommonModule, FormsModule
  ]
})
export class QuestsPage implements OnInit {

  constructor(
    public rt: RealtimeDatabaseService,
  ) {
    addIcons({ timeOutline });
  }

  public dados: Array<any> = [];
  public score: number = 1000;
  public quests: Quest[] = [];
  public questsGrouped: { [key: string]: Quest[] } = {};

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

            if (this.quests.length === 0) {
              this.quests.push(...quests);
            }
            
            if (!this.questsGrouped[alarmName]) {
              this.questsGrouped[alarmName] = [];
            }
            this.questsGrouped[alarmName].push(...quests);

            this.telaVazia();

            return [...acc, item];
          }, []);
        } else {
          this.dados = [];
        }
      });
    });
  }

  ngOnInit() {
    this.load();
  }

  public hasQuests = signal<boolean>(false);
  
  telaVazia() {
    const hasData = this.quests.length > 0;
    this.hasQuests.set(hasData); 
  }
}
