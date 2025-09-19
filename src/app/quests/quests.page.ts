import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonText,
  IonImg,
  IonIcon,
  IonCard,
  IonAvatar,
  IonCheckbox
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { albumsOutline, checkmarkCircleOutline } from 'ionicons/icons';

interface Quest {
  name: string;
  points: number;
  image: string;
  challenges: string[];
}

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonCard,
    IonAvatar,
    IonImg,
    IonText,
    IonContent,
    CommonModule,
    FormsModule,
    IonCheckbox
  ]
})
export class QuestsPage implements OnInit {
  public score: number = 1000;
  
  // Começa como false para mostrar a tela "vazia".
  public hasQuests = signal<boolean>(false);

  // Dados fictícios para o design.
  public mockQuests: Quest[] = [
    {
      name: 'Beber Água',
      points: 50,
      image: 'assets/imagens/copo.png',
      challenges: [
        'Copo de água ao coidar',
        'Copo de água antes de muçar',
        'Copo de água antes de mimir'
      ]
    },
    {
      name: 'Missão de Corrida',
      points: 75,
      image: 'assets/imagens/run.png',
      challenges: [
        'Correr',
        'Correr bastantinho',
        'La corida'
      ]
    }
  ];

  constructor() {
    addIcons({ albumsOutline, checkmarkCircleOutline });
  }

  ngOnInit() {
    this.telaVazia()
    
  }

  telaVazia(){
    if(this.mockQuests.length == 0){
      // Para ver o design, mudar o valor abaixo pra 'true'
      this.hasQuests.set(false); 
    }else this.hasQuests.set(true); 
  }
}
