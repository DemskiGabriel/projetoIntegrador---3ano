import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { GestureController, GestureDetail } from "@ionic/angular";
import { IonContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: "app-feed",
  templateUrl: "./feed.page.html",
  styleUrls: ["./feed.page.scss"],
  standalone: true,
  imports: [IonButton, IonCardContent, IonCardSubtitle, IonCardHeader, IonCard, IonContent, CommonModule, FormsModule]
})
export class FeedPage {
  constructor(
    private gestureCtrl: GestureController,
    private cdRef: ChangeDetectorRef
  ) {}

  

  tasks = [
    { id: 1, title: "Missão 1", points: 10, completo: false },
    { id: 2, title: "Missão 2", points: 20, completo: false },
    { id: 3, title: "Missão 3", points: 30, completo: false },
    { id: 4, title: "Missão 4", points: 40, completo: false }
  ];

  @ViewChildren('cardElem', { read: ElementRef }) cards!: QueryList<ElementRef>;
  ngAfterViewInit() {
    this.cards.forEach((card, index) => {
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: "swipe",
        onMove: (detail) => this.onMove(detail, card),
        onEnd: (detail) => this.onEnd(detail, card, index)
      });
      gesture.enable();
    });
  }

  private onMove(detail: GestureDetail, card: ElementRef) {
    card.nativeElement.style.transform = `translateX(${detail.deltaX}px)`;
  }

  private onEnd(detail: GestureDetail, card: ElementRef, index: number) {
    if (Math.abs(detail.deltaX) > 100) {
      // desliza para fora
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = `translateX(${detail.deltaX > 0 ? 1000 : -1000}px)`;

      // marca como completo após animação
      setTimeout(() => {
        this.tasks[index].completo = true; // ✅ agora só marca como completo
        this.cdRef.detectChanges();
      }, 300);
    } else {
      // volta para posição original
      card.nativeElement.style.transition = "0.3s";
      card.nativeElement.style.transform = "translateX(0)";
    }
  }

  trackByFn(index: number, item: any) {
    return item.id;
  }
}
