import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequisicaoService } from '../../service/requisicao.service';
import { Router } from '@angular/router';

import {
  IonContent,
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
  IonText
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  standalone: true,
  imports: [
    IonImg,
    IonContent,
    IonCard,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonText,
    CommonModule,
    FormsModule,
  ]
})
export class CadastroPage implements OnInit {
  public nome: string = '';
  public email: string = '';
  public senha: string = '';
  public dataNascimento: string = '';
  public genero: string = '';

  public confirmarSenha: string = '';

  public erroCamposVazios: string = '';
  public erroSenhasNaoCoincidem: string = '';

  constructor(
    public rs: RequisicaoService,
    private router: Router
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
    this.erroCamposVazios = '';
    this.erroSenhasNaoCoincidem = '';
    

    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha || !this.dataNascimento || !this.genero) {
      this.erroCamposVazios = 'Todos os campos devem ser preenchidos.';
      return; 
    }
    
    if (this.senha !== this.confirmarSenha) {
      this.erroSenhasNaoCoincidem = 'As senhas não coincidem.';
      return;
    }

    const partes = this.dataNascimento.split('/');
    let dataFormatada = '';
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      dataFormatada = `${ano}-${mes}-${dia}`;
    }
    

    const fd = new FormData();
    fd.append('controller', 'cadastro');
    fd.append('username', this.nome);
    fd.append('email', this.email);
    fd.append('password', this.senha);
    fd.append('birthday', dataFormatada);
    fd.append('gender', this.genero);

    this.rs.post(fd).subscribe(
      (response: any) => {
        console.log('Cadastro bem-sucedido!', response);
        localStorage.setItem('userId', response);
        this.router.navigate(['/questionario']);
      },
      (error: any) => {
        console.error('Erro ao cadastrar:', error);
      }
    );
  }
}