import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonDatetime,
    IonSelect,
    IonSelectOption,
    IonButton,
    CommonModule,
    FormsModule
  ]
})
export class CadastroPage implements OnInit {

  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  dataNascimento: string = '';
  sexo: string = '';

  constructor() { }

  ngOnInit() { }

  cadastrar() {
    console.log('Dados do cadastro:', {
      nome: this.nome,
      email: this.email,
      senha: this.senha,
      confirmarSenha: this.confirmarSenha,
      dataNascimento: this.dataNascimento,
      sexo: this.sexo
    });
  }

}
