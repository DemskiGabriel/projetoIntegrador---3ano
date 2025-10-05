import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonText, 
  IonImg, 
  IonItem,
  GestureDetail
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons'; 
import { RealtimeDatabaseService } from 'src/app/firebase/realtime-database';
import { GestureController } from '@ionic/angular';

interface Quest {
  challengeName: string;
  alarmName: string;
  points: number;
  challenges: string;
  completo: boolean;
}

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
  standalone: true,
  imports: [IonImg, IonText, IonContent, IonItem, CommonModule, FormsModule]
})
export class QuestsPage implements OnInit {

  constructor(
    public rt: RealtimeDatabaseService,
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef
  ) {
    addIcons({ timeOutline });
  }

  public dados: Array<any> = [];
  public dadosOrigin: Array<any> = [];

  public score: number = 0;
  
  public quests: Quest[] = [];
  public questsGrouped: { [key: string]: Quest[] } = {};

  public hasQuests = signal<boolean>(false);

  @ViewChildren('cardElem', { read: ElementRef }) cards!: QueryList<ElementRef>;

  ngOnInit() {
    this.load();
  }

  ngAfterViewInit() {
    // Sempre que novos cards forem renderizados
    this.cards.changes.subscribe(() => this.bindGestures());
  }


  private bindGestures() {
    this.cards.forEach((card) => {
      if ((card as any).__gestureAttached) return; // evita duplicar gestures

      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onMove: (detail) => this.onMove(detail, card),
        onEnd: (detail) => this.onEnd(detail, card)
      });
      gesture.enable();

      (card as any).__gestureAttached = true;
    });
  }

  private onMove(detail: GestureDetail, card: ElementRef) {
    card.nativeElement.style.transform = `translateX(${detail.deltaX}px)`;
  }

  private onEnd(detail: GestureDetail, card: ElementRef) {
    if (Math.abs(detail.deltaX) > 100) {
      // desliza para fora
      card.nativeElement.style.transition = '0.3s';
      card.nativeElement.style.transform = `translateX(${detail.deltaX > 0 ? 1000 : -1000}px)`;

      // encontra a quest pelo data-quest-id e marca como completo
      const tituloMissao = card.nativeElement.getAttribute('data-quest-id');

      // Primeiro, encontra o índice do grupo
      const grupoIndex = this.dados.findIndex(grupo =>
        grupo && grupo.missoes.some((m: any) => m.titulo === tituloMissao)
      );

      if (grupoIndex !== -1) {
        const grupo = this.dados[grupoIndex];

        // Agora encontra o índice da missão dentro do grupo
        const missaoIndex = grupo.missoes.findIndex((m: any) => m.titulo === tituloMissao);

        if (missaoIndex !== -1) {
          const missao = grupo.missoes[missaoIndex];
          
          // Atualiza os dados
          missao.completo = true;
          this.score += missao.pontos;

          this.salvar(grupoIndex, missaoIndex)
        }
      }



      setTimeout(() => {
        this.cdRef.detectChanges(); // atualiza a tela para remover o card
      }, 300);

    } else {
      // volta para posição original
      card.nativeElement.style.transition = '0.3s';
      card.nativeElement.style.transform = 'translateX(0)';
    }
  }

  load() {
    this.dados = [];
    this.quests = [];
    this.questsGrouped = {};

    this.rt.query('/alarme', (snapshotAlarme: any) => {
      const alarmes = snapshotAlarme.val() || {};

      this.rt.query('/missoes', (snapshot: any) => {
        if (snapshot.val() !== null) {
          this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
            const missoesArr = Array.isArray(item.missoes) ? item.missoes : [];
            const alarmName = alarmes[item.idAlarme]?.nomeAlarme || `Alarme ${item.idAlarme}`;

            const quests: Quest[] = missoesArr.map((m: any) => ({
              challengeName: m.titulo,
              alarmName: alarmName,
              points: m.pontos,
              challenges: m.descricao,
              completo: m.completo
            }));

            this.quests.push(...quests);
            this.questsGrouped[alarmName] = [...quests];

            this.dadosOrigin = this.dados;

            return item;
          });

          this.telaVazia();
        } else {
          this.dados = [];
          this.quests = [];
          this.questsGrouped = {};
          this.telaVazia();
        }
      });
    });
  }

  telaVazia() {
    this.hasQuests.set(this.quests.some(q => !q.completo));
  }


  salvar(i:number, ii:number){
    this.rt.update(
      `missoes/${i+1}/missoes/${ii}`, 
      {
        completo: true,
        descricao: this.dados[i].missoes[ii].descricao,
        pontos: this.dados[i].missoes[ii].pontos,
        titulo: this.dados[i].missoes[ii].titulo
      }
    )
    .then(() => console.log('🔥 Dados atualizados com sucesso!'))
    .catch(err => console.error('Erro ao atualizar:', err));
  }

  // Fazer salvar a pontuação no usuario
}
