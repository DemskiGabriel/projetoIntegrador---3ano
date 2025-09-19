import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonImg,
  IonChip,
  IonText,
  IonButtons
} from '@ionic/angular/standalone';

interface Task {
  title: string;
  points: number;
  image: string;
  time: string;
  status: string;
  cardColor: string;
}

@Component({
  selector: 'app-missions',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonImg,
    IonChip,
    IonText,
    IonButtons
  ]
})
export class FeedPage implements OnInit {
  public score: number = 0;
  public tasks: Task[] = [
    {
      title: 'Beber Água',
      points: 50,
      image: 'assets/imagens/copo.png',
      time: '14:00',
      status: 'Feito',
      cardColor: '#FDD835'
    },
    {
      title: 'Caminhada',
      points: 100,
      image: 'assets/imagens/run.png',
      time: '18:00',
      status: 'Disponível',
      cardColor: '#8BC34A'
    },
    {
      title: 'Ler Livro',
      points: 75,
      image: 'assets/imagens/books.png',
      time: '20:00',
      status: 'Disponível',
      cardColor: '#90CAF9'
    }
  ];

  public activeTaskIndex: number = 0;
  private startX: number = 0;
  public transformX: number = 0;

  constructor() { }

  ngOnInit() {
    this.updateScore();
  }

  updateScore() {
    // Lógica para atualizar o score. Poderia ser a partir de uma API.
    // Para o exemplo, vamos somar os pontos de uma tarefa concluída.
    this.score = this.tasks.find(task => task.status === 'Feito')?.points || 0;
  }

  handleTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
  }

  handleTouchMove(event: TouchEvent) {
    const deltaX = event.touches[0].clientX - this.startX;
    this.transformX = deltaX;
  }

  handleTouchEnd(event: TouchEvent) {
    const endX = event.changedTouches[0].clientX;
    const deltaX = endX - this.startX;
    const swipeThreshold = 50;

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        // Desliza para a direita 
        if (this.activeTaskIndex > 0) {
          this.activeTaskIndex--;
        }
      } else {
        // Desliza para a esquerda 
        if (this.activeTaskIndex < this.tasks.length - 1) {
          this.activeTaskIndex++;
        }
      }
    }
    this.transformX = -this.activeTaskIndex * 344; // 344 é a largura do 'track'
  }
}