
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonImg, IonCard } from '@ionic/angular/standalone';
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

  imports: [IonCard, IonImg, IonText, IonContent, CommonModule, FormsModule]
})
export class QuestsPage implements OnInit {
  public score: number = 1000;
  
  // Começa como false para mostrar a tela "vazia".
  public hasQuests = signal<boolean>(false);


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


  // Mostra uma mensagem na tela caso não tenha nenhuma missão
  telaVazia(){
    if(this.mockQuests.length == 0){
      // Para ver o design, mudar o valor abaixo pra 'true'
      this.hasQuests.set(false); 
    }else this.hasQuests.set(true); 
  }
}
