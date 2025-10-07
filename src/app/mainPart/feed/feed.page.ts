import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GestureController, GestureDetail } from "@ionic/angular";
import { IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonText } from "@ionic/angular/standalone";
import { RealtimeDatabaseService } from "src/app/firebase/realtime-database";

// Define a interface para os dados que serão exibidos, incluindo a cor
interface VisibleAlarm {
  idGrupoDeAlarmes: string;
  idAlarme: string;
  nomeAlarme: string;
  maisProximo: string;
  horaTimestamp: number;
  indexPai: number;
  rawAlarme: any;
  itemOriginal: any;
  cardColor: string; // Cor fixada para o card
}

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"],
  standalone: true,
  imports: [IonText, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonContent, CommonModule, FormsModule]
})
export class FeedPage {
  public dados: Array<any> = [];
  public proximosAlarmes: VisibleAlarm[] = [];
  public visibleAlarms: VisibleAlarm[] = [];

  // Array de cores pastel para alternar entre os cards
  private cardColors: string[] = [
    '#f4e4ff', // 1. Lavanda Suave
        '#e4efff', // 2. Azul Bebê
        '#fff0e4', // 3. Pêssego Claro
        '#e7fff0', // 4. Menta Suave
        '#fff0f5', // 5. Rosa Claro
        '#f9f9e7', // 6. Amarelo Gema Claro
        '#e4fff9', // 7. Ciano Suave
        '#f9e4ff', // 8. Roxo Claro
        '#ffe4e7', // 9. Rosa Salmão Claro
        '#f0f0ff', // 10. Azul Nuvem
        '#f7f0ff', // 11. Ultra Lavanda
        '#e6f7ff', // 12. Azul Céu Pastel
        '#ffeecc', // 13. Creme de Pêssego
        '#d6f5d6', // 14. Verde Pastel
        '#ffebf5', // 15. Rosa Pó
        '#f5f5e6', // 16. Bege Suave
        '#e0f5f5', // 17. Verde Água Claro
        '#e6e0ff', // 18. Violeta Claro
        '#fff5e0', // 19. Laranja Suave
        '#d8e2dc', // 20. Cinza Névoa
        '#fce4ec', // 21. Rosa Algodão Doce
        '#e8f8f8', // 22. Turquesa Pálido
        '#fcf4e8', // 23. Areia Suave
        '#e0eaff', // 24. Azul Gelo
        '#ffebcc', // 25. Amarelo Manteiga
        '#f5e6ff', // 26. Malva Claro
        '#d9f7e5', // 27. Verde Hortelã Pastel
        '#ffe0f0', // 28. Rosa Bebê Profundo
        '#eaf5ff', // 29. Azul Claro
        '#f7e8df', // 30. Bege Rosado
        '#f0fff0', // 31. Verde Primavera
        '#f2e6e6', // 32. Rosa Quartzo
        '#e6fff2', // 33. Verde Kiwi Claro
        '#fefefe', // 34. Branco Quase Off-White
        '#e8d9ff', // 35. Lilás Pastel
        '#d9e6f2', // 36. Azul Sereno
        '#fffae6', // 37. Amarelo Vainilla
        '#e6f2d9', // 38. Verde Oliva Claro
        '#f2e6f9', // 39. Púrpura Suave
        '#e0ffff', // 40. Ciano Água Pálido
  ];

  constructor(
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef,
    public rt: RealtimeDatabaseService,
  ) { }

  ionViewWillEnter() {
    this.load();
  }

  // ---------- Função de Hash de Cor Estável ----------
  // Usa o nome do alarme (string) para gerar um hash numérico
  // O hash é usado para selecionar uma cor do array 'cardColors' de forma consistente.
  private getStableColorHash(inputString: string): string {
    let hash = 0;
    if (inputString.length === 0) return this.cardColors[0];

    for (let i = 0; i < inputString.length; i++) {
      const char = inputString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Converte para um inteiro de 32 bits
    }

    // Usa o módulo para garantir que o índice esteja dentro do limite do array de cores
    const index = Math.abs(hash) % this.cardColors.length;
    return this.cardColors[index];
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
          item.cor = this.getStableColorHash(item.nomeAlarme || 'default');

          return item;
        }).filter((item: any) => item.user === this.userId);

        console.log(this.dados);
        

        // Monta array de proximosAlarmes (com a cor já atribuída)
        this.montarProximosAlarmes();

        this.cdRef.detectChanges();
        // Garante que os cards existam antes de iniciar os gestos
        if (this.cards && this.cards.length > 0) {
          setTimeout(() => this.initGestures(), 100);
        }
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

  // ---------- Monta array proximosAlarmes (com adição de cor FIXA pelo título) ----------
  private getNextOccurrenceTimestamp(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    const now = new Date();
    const dt = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0, 0);
    if (dt.getTime() <= now.getTime()) dt.setDate(dt.getDate() + 1);
    return dt.getTime();
  }

  private montarProximosAlarmes() {
    let tempAlarmes: VisibleAlarm[] = [];

    this.dados.forEach(item => {
      if (!item.alarmes || !Array.isArray(item.alarmes)) return;

      item.alarmes.forEach((alarme: any, idx: number) => {
        if (!alarme || !alarme.hora || !alarme.ativo) return;

        const ts = this.getNextOccurrenceTimestamp(alarme.hora);

        tempAlarmes.push({
          idGrupoDeAlarmes: item.id,
          idAlarme: alarme.id ?? String(idx),
          nomeAlarme: item.nomeAlarme || 'Sem nome',
          maisProximo: alarme.hora,
          horaTimestamp: ts,
          indexPai: idx,
          rawAlarme: alarme,
          itemOriginal: item,
          cardColor: item.cor // Cor agora é fixa pelo nome do alarme pai
        });
      });
    });

    // 1. Ordena o array completo
    tempAlarmes.sort((a, b) => a.horaTimestamp - b.horaTimestamp);

    // 2. Armazena o array completo ordenado (com cores fixas)
    this.proximosAlarmes = tempAlarmes;

    // 3. Define os 5 visíveis
    this.visibleAlarms = this.proximosAlarmes.slice(0, 5);
  }

  // Função para encontrar o próximo card na lista geral que não está visível
  private findNextNonVisibleAlarm(removedAlarm: VisibleAlarm): VisibleAlarm | undefined {
    // Cria um conjunto de chaves (idGrupoDeAlarmes-indexPai) dos alarmes visíveis
    const visibleAlarmKeys = new Set(this.visibleAlarms.map(v => `${v.idGrupoDeAlarmes}-${v.indexPai}`));

    // Busca no array ordenado 'proximosAlarmes'
    return this.proximosAlarmes.find(a => {
      const alarmKey = `${a.idGrupoDeAlarmes}-${a.indexPai}`;
      // O alarme deve ser diferente do que foi removido
      // E não deve estar atualmente no array de alarmes visíveis
      return alarmKey !== `${removedAlarm.idGrupoDeAlarmes}-${removedAlarm.indexPai}` &&
        !visibleAlarmKeys.has(alarmKey);
    });
  }

  // ---------- Animação dos cards ----------
  @ViewChildren('cardElem', { read: ElementRef }) cards!: QueryList<ElementRef>;

  private initGestures() {
    // Destrói gestos anteriores e recria apenas para os cards visíveis atualmente
    if (this.cards) {
      this.cards.forEach(card => {
        const existingGesture = (card.nativeElement as any)._gesture;
        if (existingGesture) {
          existingGesture.destroy();
        }
      });
    }

    this.cards.forEach((card, i) => {
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'swipe',
        onMove: (detail) => this.onMove(detail, card),
        onEnd: (detail) => this.onEnd(detail, card, i),
      });
      gesture.enable();
      // Armazena o objeto gesture no elemento DOM para destruição futura
      (card.nativeElement as any)._gesture = gesture;
    });
  }

  private onMove(detail: GestureDetail, card: ElementRef) {
    // Permite que o card deslize na tela
    card.nativeElement.style.transform = `translate(${detail.deltaX}px, ${detail.deltaY}px)`;
    // Adiciona uma leve rotação para dar o efeito "swipe"
    const rotation = detail.deltaX / 20;
    card.nativeElement.style.transform += ` rotate(${rotation}deg)`;
  }

  private onEnd(detail: GestureDetail, card: ElementRef, i: number) {
    const swipeThreshold = 100;

    if (Math.abs(detail.deltaX) > swipeThreshold) {
      // Swipe para Concluir (Lógica de remoção e atualização)
      card.nativeElement.style.transition = "0.3s ease-out";
      card.nativeElement.style.transform = `translate(${detail.deltaX > 0 ? 1000 : -1000}px, 0) rotate(${detail.deltaX > 0 ? 30 : -30}deg)`;
      card.nativeElement.style.opacity = '0';

      setTimeout(() => {
        const removido = this.visibleAlarms[i];

        // 1. Atualiza o status de 'ativo' no banco de dados 
        this.rt.update(`/alarme/${removido.idGrupoDeAlarmes}/alarmes/${removido.indexPai}`, { ativo: false, hora: removido.maisProximo })
          .then(() => console.log('✅ Alarme desativado (Concluído/Swiped)'))
          .catch(err => console.error('Erro ao atualizar alarme:', err));

        // 2. Remove do array visível
        this.visibleAlarms.splice(i, 1);

        // 3. Reposição: Pega o próximo da lista de todos os alarmes que não está visível
        const proximo = this.findNextNonVisibleAlarm(removido);

        if (proximo) {
          // Adiciona o card que já tem sua cor fixa
          this.visibleAlarms.push(proximo);
        }

        // Dispara a detecção para atualizar o HTML e reindexar os cards
        this.cdRef.detectChanges();
        // Reinicia os gestos para os novos/reposicionados cards
        setTimeout(() => this.initGestures(), 50);
      }, 300);
    } else {
      // Retorna para a posição original
      card.nativeElement.style.transition = "0.3s ease-out";
      card.nativeElement.style.transform = "translate(0, 0) rotate(0deg)";
    }
  }

  getCardTop(i: number): number {
    return 15 + Math.log(i + 1) * 3;
  }
}
