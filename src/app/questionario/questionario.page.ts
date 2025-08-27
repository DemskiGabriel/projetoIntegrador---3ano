import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations'; 

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonImg,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonItem,
  IonButton,
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.page.html',
  styleUrls: ['./questionario.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonImg,
    IonCard,
    IonCardContent,
    IonCheckbox,
    IonItem,
    IonButton,
    IonText,
    CommonModule,
    FormsModule
  ],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('400ms ease-in-out', style({ transform: 'translateX(0%)', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ transform: 'translateX(0%)', opacity: 5 }),
        animate('400ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class QuestionarioPage implements OnInit {

  // Variável para controlar o passo atual do questionário
  public currentStep: number = 1;

  // Variáveis para armazenar as respostas
  public horariosAnswer: string | null = null;
  public tempoLivreAnswer: string | null = null;
  public tempoCelularAnswer: string | null = null;
  public diasSemanaAnswer: string | null = null;
  public pausasLivresAnswer: string | null = null;

  // Variável para a mensagem de erro
  public errorMessage: string = '';

  // Estrutura de dados para as opções de cada pergunta
  public horariosOptions = [
    { label: 'Manhã (06h – 12h)', value: 'manha' },
    { label: 'Tarde (12h – 18h)', value: 'tarde' },
    { label: 'Noite (18h – 00h)', value: 'noite' },
    { label: 'Madrugada (00h – 06h)', value: 'madrugada' }
  ];

  public tempoLivreOptions = [
    { label: 'De 10 a 30 minutos', value: '10-30min' },
    { label: 'De 30 a 60 minutos', value: '30-60min' },
    { label: 'Mais de 1 hora', value: 'maisde1h' }
  ];

  public tempoCelularOptions = [
    { label: 'Menos de 1 hora', value: 'menosde1h' },
    { label: '1 a 3 horas', value: '1-3h' },
    { label: '3 a 5 horas', value: '3-5h' },
    { label: 'Mais de 5 horas', value: 'maisde5h' }
  ];
  
  public diasSemanaOptions = [
    { label: 'Dias úteis', value: 'uteis' },
    { label: 'Fins de semana', value: 'finsdesemana' },
    { label: 'Todos os dias', value: 'todosdias' },
    { label: 'Depende da semana', value: 'depende' }
  ];
  
  public pausasLivresOptions = [
    { label: 'Nenhuma', value: 'nenhuma' },
    { label: '1 a 2 pausas', value: '1-2pausas' },
    { label: '3 a 4 pausas', value: '3-4pausas' },
    { label: 'Mais de 4 pausas', value: 'maisde4pausas' }
  ];

  constructor() { }

  ngOnInit() {
  }

  // Lógica para lidar com a mudança de checkbox para garantir uma única seleção por pergunta
  onCheckboxChange(questionId: string, value: string, event: any) {
    if (event.detail.checked) {
      // Define a resposta para a pergunta correspondente
      switch (questionId) {
        case 'horarios':
          this.horariosAnswer = value;
          break;
        case 'tempoLivre':
          this.tempoLivreAnswer = value;
          break;
        case 'tempoCelular':
          this.tempoCelularAnswer = value;
          break;
        case 'diasSemana':
          this.diasSemanaAnswer = value;
          break;
        case 'pausasLivres':
          this.pausasLivresAnswer = value;
          break;
      }
    } else {
       // Limpa a resposta se a opção for desmarcada
       switch (questionId) {
        case 'horarios':
          this.horariosAnswer = null;
          break;
        case 'tempoLivre':
          this.tempoLivreAnswer = null;
          break;
        case 'tempoCelular':
          this.tempoCelularAnswer = null;
          break;
        case 'diasSemana':
          this.diasSemanaAnswer = null;
          break;
        case 'pausasLivres':
          this.pausasLivresAnswer = null;
          break;
      }
    }
  }

  // Lógica para avançar para o próximo passo
  nextStep() {
    this.errorMessage = ''; // Limpa a mensagem de erro
    
    if (this.currentStep === 1) {
      if (this.horariosAnswer && this.tempoLivreAnswer) {
        this.currentStep = 2; // Avança para o passo 2
      } else {
        this.errorMessage = 'Por favor, responda todas as perguntas para continuar.';
      }
    } else if (this.currentStep === 2) {
      if (this.tempoCelularAnswer && this.diasSemanaAnswer) {
        this.currentStep = 3; // Avança para o passo 3
      } else {
        this.errorMessage = 'Por favor, responda todas as perguntas para continuar.';
      }
    } else if (this.currentStep === 3) {
      if (this.pausasLivresAnswer) {
        // Todas as perguntas foram respondidas
        this.errorMessage = 'Questionário finalizado! Obrigado.';
        console.log('Respostas:', {
          horarios: this.horariosAnswer,
          tempoLivre: this.tempoLivreAnswer,
          tempoCelular: this.tempoCelularAnswer,
          diasSemana: this.diasSemanaAnswer,
          pausasLivres: this.pausasLivresAnswer
        });
        // Aqui você pode enviar os dados para um serviço ou API
      } else {
        this.errorMessage = 'Por favor, responda a última pergunta para finalizar.';
      }
    }
  }
}