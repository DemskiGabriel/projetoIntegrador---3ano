import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GestureController, GestureDetail } from "@ionic/angular";
import { IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonText } from "@ionic/angular/standalone";
import { RealtimeDatabaseService } from "src/app/firebase/realtime-database";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"],
  standalone: true,
  imports: [IonText, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonContent, CommonModule, FormsModule]
})
export class FeedPage{
  public dados: Array<any> = [];

  constructor(
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef,
    public rt: RealtimeDatabaseService,
  ) {}

  ionViewWillEnter(){
    this.load();
  }

  // ---------- Load ----------
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
        // Carrega as animações.
        this.cdRef.detectChanges();
        setTimeout(() => this.initGestures(), 100);
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


  // ---------- Animação dos cards ----------
  @ViewChildren('cardElem', { read: ElementRef }) cards!: QueryList<ElementRef>;
  private initGestures() {
    if (!this.cards) return;

    this.cards.forEach((card) => {
      const i = Number(card.nativeElement.getAttribute('data-i'));
      const ii = Number(card.nativeElement.getAttribute('data-ii'));

      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onMove: (detail) => this.onMove(detail, card),
        onEnd: (detail) => this.onEnd(detail, card, i, ii),
      });
      gesture.enable();
    });
  }

  private onMove(detail: GestureDetail, card: ElementRef) {
    card.nativeElement.style.transform = `translate(${detail.deltaX}px, ${detail.deltaY}px)`;
  }

  private onEnd(detail: GestureDetail, card: ElementRef, i: number, ii:number) {
    if (Math.abs(detail.deltaX) > 100) {
      // desliza para fora
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = `translateX(${detail.deltaX > 0 ? 1000 : -1000}px)`;

      setTimeout(() => {
        this.dados[i].alarmes[ii].ativo = false;
        this.atualizarDados(i, ii);

        this.cdRef.detectChanges();
      }, 300);
    } else {
      // volta para posição original
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = "translateX(0)";
    }
  }

  getCardTop(i: number): number {
    return 15 + Math.log(i + 1) * 3; // mesma lógica do Math.log
  }

  // ---------- Salvar ----------
  atualizarDados(i: number, ii: number){
    // atualiza no banco
    this.rt.update(`/alarme/${this.dados[i].id}/alarmes/${ii}`, { ativo: false, hora: this.dados[i].alarmes[ii].hora })
      .then(() => console.log('✅ Alarme desativado'))
      .catch(err => console.error('Erro ao atualizar alarme:', err));
  }
}