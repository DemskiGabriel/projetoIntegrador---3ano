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
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonImg,
  
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [IonImg,  
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    CommonModule,
    FormsModule,
    IonImg
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
    public rs: RequisicaoService
  ) { }

  ngOnInit() {
  }

  formatarData(event: any) {
    let valor = event.detail.value;
    if (!valor) return;

    valor = valor.replace(/\D/g, '');

    if (valor.length > 2 && valor.length <= 4) {
      valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    event.target.value = valor;
  }

  cadastrar() {
    const fd = new FormData();
    fd.append('controller', 'cadastro');
    fd.append('username', this.nome);
    fd.append('email', this.email);
    fd.append('password', this.senha);
    fd.append('birthday', this.dataNascimento);
    fd.append('gender', this.genero);

    this.rs.post(fd).subscribe();
  }
}