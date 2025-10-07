import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
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
export class FeedPage {
  public dados: Array<any> = [];
  public proximosAlarmes: Array<any> = [];
  public visibleAlarms: Array<any> = []; // apenas os 5 visíveis

  constructor(
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef,
    public rt: RealtimeDatabaseService,
  ) {}

  ionViewWillEnter() {
    this.load();
  }

  // ---------- Load ----------
  public userId: string = localStorage.getItem('userId') || '';

  load() {
    this.rt.query('/alarme', (snapshot: any) => {
      if (snapshot.val() !== null) {
        this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
          item.id = key;
          item.alarmes = Array.isArray(item.alarmes) ? item.alarmes : [];
          item.proximoAlarme = this.getProximoAlarme(item);
          return item;
        }).filter((item: any) => item.user === this.userId);

        // Monta array de proximosAlarmes
        this.montarProximosAlarmes();

        this.cdRef.detectChanges();
        setTimeout(() => this.initGestures(), 100);
      } else {
        this.dados = [];
        this.proximosAlarmes = [];
        this.visibleAlarms = [];
      }
    });
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

    if (proximo) return proximo.hora;

    const primeiroAtivo = item.alarmes.find((a: any) => a.ativo);
    return primeiroAtivo ? primeiroAtivo.hora : null;
  }

  // ---------- Monta array proximosAlarmes ----------
  private getNextOccurrenceTimestamp(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    const now = new Date();
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    if (dt.getTime() <= now.getTime()) dt.setDate(dt.getDate() + 1);
    return dt.getTime();
  }

  private montarProximosAlarmes() {
    this.proximosAlarmes = [];

    this.dados.forEach(item => {
      if (!item.alarmes || !Array.isArray(item.alarmes)) return;

      item.alarmes.forEach((alarme: any, idx: number) => {
        if (!alarme || !alarme.hora || !alarme.ativo) return;

        const ts = this.getNextOccurrenceTimestamp(alarme.hora);

        this.proximosAlarmes.push({
          idGrupoDeAlarmes: item.id,
          idAlarme: alarme.id ?? String(idx),
          nomeAlarme: item.nomeAlarme || 'Sem nome',
          maisProximo: alarme.hora,
          horaTimestamp: ts,
          indexPai: idx,
          rawAlarme: alarme,
          itemOriginal: item
        });
      });
    });

    // Ordena do mais próximo para mais distante
    this.proximosAlarmes.sort((a, b) => a.horaTimestamp - b.horaTimestamp);

    // Os 5 primeiros para mostrar
    this.visibleAlarms = this.proximosAlarmes.slice(0, 5);
  }

  // ---------- Animação dos cards ----------
  @ViewChildren('cardElem', { read: ElementRef }) cards!: QueryList<ElementRef>;

  private initGestures() {
    if (!this.cards) return;
    this.cards.forEach((card, i) => {
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onMove: (detail) => this.onMove(detail, card),
        onEnd: (detail) => this.onEnd(detail, card, i),
      });
      gesture.enable();
    });
  }

  private onMove(detail: GestureDetail, card: ElementRef) {
    card.nativeElement.style.transform = `translate(${detail.deltaX}px, ${detail.deltaY}px)`;
  }

  private onEnd(detail: GestureDetail, card: ElementRef, i: number) {
    if (Math.abs(detail.deltaX) > 100) {
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = `translateX(${detail.deltaX > 0 ? 1000 : -1000}px)`;

      setTimeout(() => {
        const removido = this.visibleAlarms[i];

        // Desativa no banco
        this.rt.update(`/alarme/${removido.idGrupoDeAlarmes}/alarmes/${removido.indexPai}`, { ativo: false, hora: removido.maisProximo })
          .then(() => console.log('✅ Alarme desativado'))
          .catch(err => console.error('Erro ao atualizar alarme:', err));

        // Remove do array visível
        this.visibleAlarms.splice(i, 1);

        // Reposição: pega o próximo da lista que ainda não está visível
        const proximo = this.proximosAlarmes.find(a => !this.visibleAlarms.includes(a) && a !== removido);
        if (proximo) this.visibleAlarms.push(proximo);

        this.cdRef.detectChanges();
      }, 300);
    } else {
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = "translateX(0)";
    }
  }

  getCardTop(i: number): number {
    return 15 + Math.log(i + 1) * 3;
  }
}
