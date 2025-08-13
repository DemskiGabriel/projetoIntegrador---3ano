import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequisicaoService } from '../service/requisicao.service';

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
  IonButton,
  IonAlert
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
    FormsModule,
    IonAlert
  ]
})
export class CadastroPage implements OnInit {
  public nome: string = '';
  public email: string = '';
  public senha: string = '';
  public dataNascimento: string = '';
  public genero: string = '';

  public confirmarSenha: string = '';

  constructor(
    public rs:RequisicaoService
  ) { }

  ngOnInit() { 
  }

  cadastrar() {
    const fd = new FormData();
    fd.append('controller', 'cadastro');
    fd.append('username', this.nome);
    fd.append('email', this.email);
    fd.append('password', this.senha);
    fd.append('birthday', this.dataNascimento);
    fd.append('gender', this.genero);

    this.rs.post(fd)
    .subscribe();
    };
  }


