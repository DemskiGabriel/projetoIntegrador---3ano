import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
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
    public autenticacao_service:AutenticacaoService,
    private router: Router) { }

  ngOnInit() {
  }

  async proximo() {
    // Validação primeiro
    if (!this.email) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos!',
        buttons: ['OK']
      });
  
      await alert.present();
      return; // <- Aqui garante que NÃO vai executar nada abaixo
    }
  
    // Se o email tiver valor, só aí chama o serviço
    this.autenticacao_service
      .proximo(this.email)
      .subscribe(async (_res: any) => {
        if (_res.status === 'sucess') {
          sessionStorage.setItem('token', _res.token);
          this.router.navigate(['/esqueci-2']);
          // se quiser redirecionar, faz aqui com Router.navigate
        } else {
          const alert = await this.alertController.create({
            header: 'Erro',
            message: 'Email não encontrado!',
            buttons: ['OK']
          });
          await alert.present();
        }
      });
  }

}