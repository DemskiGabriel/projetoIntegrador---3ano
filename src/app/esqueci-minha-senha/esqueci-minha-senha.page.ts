import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonToolbar, IonImg, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class EsqueciMinhaSenhaPage implements OnInit {
  public email:string = '';

  constructor(private alertController: AlertController,
    public autenticacao_service:AutenticacaoService) { }

  ngOnInit() {
  }

  async proximo() {
  
    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos!',
        buttons: ['OK']
      });
  
      await alert.present();
      return; 
    }
  
   
    let email = this.email;
  
    this.autenticacao_service
      .proximo(email)
      .subscribe(
        async (_res: any) => {
          if (_res.status == 'sucess') {
            sessionStorage.setItem('token', _res.token);
          
          } else {
            const alert = await this.alertController.create({
              header: 'Erro',
              message: 'Email não encontrado!',
              buttons: ['OK']
            });
            await alert.present();
          }
        }
      );
  }

}
