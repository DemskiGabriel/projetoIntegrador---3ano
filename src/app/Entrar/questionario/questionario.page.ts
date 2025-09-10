import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations'; 

import {
  IonContent,
  IonImg,
  IonCard,
  IonCardContent,
  IonCheckbox,
  IonItem,
  IonButton,
  IonText
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { RequisicaoService } from 'src/app/service/requisicao.service';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.page.html',
  styleUrls: ['./questionario.page.scss'],
  standalone: true,
  imports: [
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
  public horariosAnswer:string = '';
  public tempoLivreAnswer:string = '';
  public tempoCelularAnswer:string = '';
  public diasSemanaAnswer:string = '';
  public pausasLivresAnswer:string = '';

  // Variável para a mensagem de erro
  public errorMessage: string = '';

  // Estrutura de dados para as opções de cada pergunta
  public horariosOptions = [
    { label: 'Manhã (06h – 12h)', value: 'morning' },
    { label: 'Tarde (12h – 18h)', value: 'afternoon' },
    { label: 'Noite (18h – 00h)', value: 'evening' },
    { label: 'Madrugada (00h – 06h)', value: 'night' }
  ];
  public tempoLivreOptions = [
    { label: 'De 10 a 30 minutos', value: '10_30min' },
    { label: 'De 30 a 60 minutos', value: '30_60min' },
    { label: 'Mais de 1 hora', value: 'maisde1h' }
  ];
  public tempoCelularOptions = [
    { label: 'Menos de 1 hora', value: 'menosde1h' },
    { label: '1 a 3 horas', value: '1_3h' },
    { label: '3 a 5 horas', value: '3_5h' },
    { label: 'Mais de 5 horas', value: 'maisde5h' }
  ];
  public diasSemanaOptions = [
    { label: 'Dias úteis', value: 'uteis' },
    { label: 'Fins de semana', value: 'finsDeSemana' },
    { label: 'Todos os dias', value: 'todosDias' }
  ];
  public pausasLivresOptions = [
    { label: 'Nenhuma', value: 'nenhuma' },
    { label: '1 a 2 pausas', value: '1_2' },
    { label: '3 a 4 pausas', value: '3_4' },
    { label: 'Mais de 4 pausas', value: 'maisde4' }
  ];

  public userId:string = localStorage.getItem('userId') || '';

  constructor(
    private router: Router,
    public rs: RequisicaoService
  ) { }

  ngOnInit() {
    console.log(this.userId);
    
    if(this.userId == ''){
      this.router.navigate(['/login']);
    }

    // localStorage.setItem('userId', '')
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
          this.horariosAnswer = '';
          break;
        case 'tempoLivre':
          this.tempoLivreAnswer = '';
          break;
        case 'tempoCelular':
          this.tempoCelularAnswer = '';
          break;
        case 'diasSemana':
          this.diasSemanaAnswer = '';
          break;
        case 'pausasLivres':
          this.pausasLivresAnswer = '';
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

        const fd = new FormData();
        fd.append('controller', 'questionario');
        fd.append('usuario_id', this.userId);
        fd.append('daytime', this.horariosAnswer);
        fd.append('freetime', this.tempoLivreAnswer);
        fd.append('screentime', this.tempoCelularAnswer);
        fd.append('weekdays', this.diasSemanaAnswer);
        fd.append('freetimeCount', this.pausasLivresAnswer);

        this.rs.post(fd).subscribe(
          (response: any) => {
            console.log('Cadastro de Questionario bem-sucedido!', response);
            this.router.navigate(['/tabs/feed']);
          },
          (error: any) => {
             console.error('Erro ao cadastrar:', error);
        }
    );
        // Aqui você pode enviar os dados para um serviço ou API
      } else {
        this.errorMessage = 'Por favor, responda a última pergunta para finalizar.';
      }
    }
  }
}