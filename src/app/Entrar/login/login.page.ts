import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { AutenticacaoService } from '../../service/autenticacao.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonImg, IonCard, RouterLink,  IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  public login:string = '';
  public senha:string = '';

  constructor(
    private alertController: AlertController,
    public autenticacao_service:AutenticacaoService,
    private router: Router
    ) { }

  ngOnInit() {
  }

 async logar(){
    let login = this.login;
    let senha = this.senha;

    this.autenticacao_service
    .logar(login,senha)
    .subscribe(
      (_res:any) => {
        if (_res.status == 'success'){
          sessionStorage.setItem('token', _res.token);
          localStorage.setItem('userId', _res.id);
          console.log("Login feito com sucesso");

          // homepage
          this.router.navigate(['/tabs/feed']);
        }else{}
      }
    );
  

    if (!this.login || !this.senha) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos!',
        buttons: ['OK'] 
      });

      await alert.present();
      return;
    }
  }
}