import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonInputOtp, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-esqueci-3',
  templateUrl: './esqueci-3.page.html',
  styleUrls: ['./esqueci-3.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonInputOtp, IonToolbar, IonImg, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class Esqueci3Page implements OnInit {

  public confirmar:string = '';
  public NovaSenha:string = '';

  constructor(private alertController: AlertController,
    public autenticacao_service:AutenticacaoService) { }

  ngOnInit() {
  }

  async proximo(){
    let confirmar = this.confirmar;
    let NovaSenha = this.NovaSenha;

    this.autenticacao_service
    .logar(confirmar,NovaSenha)
    .subscribe(
      (_res:any) => {

        if (_res.status == 'sucess'){

          sessionStorage.setItem('token',_res.token)

        }else{

          }

      }
    );
  

    if (!this.confirmar || !this.NovaSenha) {
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

