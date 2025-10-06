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
import { AutenticacaoService } from 'src/app/service/autenticacao.service';

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
export class QuestsPage{

  constructor(
    public rt: RealtimeDatabaseService,
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef,
    public autenticacao_service:AutenticacaoService
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

  ionViewWillEnter(){
    // Sempre que novos cards forem renderizados
    this.cards.changes.subscribe(() => this.bindGestures());
    this.load();
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
        const missaoIndex = grupo.missoes.findIndex((m:any) => m.titulo === tituloMissao);
      
        if (missaoIndex !== -1) {
          const missao = grupo.missoes[missaoIndex];
          missao.completo = true;
          this.score += missao.pontos;
      
          // Usa o ID original do Firebase
          this.salvar(grupo.firebaseId, missaoIndex);
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

  // Id do usuario logado.
  public userId:string = localStorage.getItem('userId') || '';
  load() {
    this.dados = [];
    this.quests = [];
    this.questsGrouped = {};
  
    this.rt.query('/alarme', (snapshotAlarme: any) => {
      const todosAlarmes = snapshotAlarme.val() || [];
  
      // 🔹 Remove valores nulos e filtra os alarmes do usuário logado
      const alarmesUsuario = todosAlarmes
        .map((a: any, index: number) => ({ ...a, id: index }))
        .filter((a: any) => a && a.user === this.userId);
  
      // Cria um mapa id → alarme
      const mapaAlarmes: Record<number, any> = {};
      alarmesUsuario.forEach((a:any) => (mapaAlarmes[a.id] = a));
  
      this.rt.query('/missoes', (snapshot: any) => {
        const todasMissoes = snapshot.val() || [];
  
        this.dados = Object.entries(todasMissoes)
        .filter(([_, missao]: [string, any]) => mapaAlarmes[missao.idAlarme])
        .map(([key, missao]: [string, any]) => {
          const missoesArr = Array.isArray(missao.missoes) ? missao.missoes : [];
          const alarmName =
            mapaAlarmes[missao.idAlarme]?.nomeAlarme || `Alarme ${missao.idAlarme}`;

          const quests: Quest[] = missoesArr.map((m: any) => ({
            challengeName: m.titulo,
            alarmName: alarmName,
            points: m.pontos,
            challenges: m.descricao,
            completo: m.completo
          }));

          this.quests.push(...quests);
          this.questsGrouped[alarmName] = [...quests];

          // 🔹 Adiciona o ID real do Firebase para referência futura
          return { ...missao, firebaseId: Number(key) };
        });


        this.dadosOrigin = this.dados;
        this.telaVazia();
      });
    });
  }
  
  
  telaVazia() {
    this.hasQuests.set(this.quests.some(q => !q.completo));
  }


  salvar(firebaseId: number, ii: number){
    this.rt.update(
      `missoes/${firebaseId}/missoes/${ii}`, 
      {
        completo: true,
        descricao: this.dados.find(d => d.firebaseId === firebaseId)!.missoes[ii].descricao,
        pontos: this.dados.find(d => d.firebaseId === firebaseId)!.missoes[ii].pontos,
        titulo: this.dados.find(d => d.firebaseId === firebaseId)!.missoes[ii].titulo
      }
    )
    .then(() => console.log('🔥 Dados atualizados com sucesso!'))
    .catch(err => console.error('Erro ao atualizar:', err));

  
    this.autenticacao_service
      .atualizarPontuacao(
        this.userId,
        this.dados.find(d => d.firebaseId === firebaseId)!.missoes[ii].pontos
      )
      .subscribe((_res: any) => {
        if (_res.status == 'success'){
          console.log(_res.msg);
        } else {
          console.error('Erro ao atualizar usuário');
        }
      });
  }
}
