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
      challenges: [
        'Copo de água ao coida, até o momento do sono. Beber todas as vezes que for á cozinha.'
      ]
    },
    {
      name: 'Missão de Corrida',
      points: 75,
      challenges: [
        'Correr até a academia, ida e volta. Subir as escadas do apartamento 2x.'
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
