import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonAlert  } from '@ionic/angular/standalone';
import { AutenticacaoService } from '../service/autenticacao.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonAlert, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  public login:string = '';
  public senha:string = '';

  constructor(
    public autenticacao_service:AutenticacaoService
  ) { }

  ngOnInit() {
  }

  logar(){
    let login = this.login;
    let senha = this.senha;

    this.autenticacao_service
    .logar(login,senha)
    .subscribe(
      (_res:any) => {
        
      }
    )
  }

}
