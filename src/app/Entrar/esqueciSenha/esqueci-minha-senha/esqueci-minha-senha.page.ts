import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../../../service/autenticacao.service';
import { AlertController } from '@ionic/angular';
import { RequisicaoService } from '../../../service/requisicao.service';

@Component({
  selector: 'app-esqueci-minha-senha',
  templateUrl: './esqueci-minha-senha.page.html',
  styleUrls: ['./esqueci-minha-senha.page.scss'],
  standalone: true,
  imports: [IonContent, RouterLink, IonImg, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class EsqueciMinhaSenhaPage implements OnInit {
  public email:string = '';
  public erroCamposVazios:string = ''
  public erroEmailNaoExiste:string = ''

  constructor(private alertController: AlertController,
    public autenticacao_service:AutenticacaoService,
    public rs:RequisicaoService,
    private router: Router) { }

  ngOnInit() {
  }

  proximo() {
    this.erroCamposVazios = '';
    this.erroEmailNaoExiste = '';

    if (!this.email) {
        this.presentAlert('Erro', 'Por favor, preencha o campo de e-mail para continuar.');
        return;
    }

    const fd = new FormData();
    fd.append('controller', 'proximo');
    fd.append('email', this.email);

    this.rs.post(fd).subscribe(
        (response: any) => {
            console.log('a', response);
            this.router.navigate(['/esqueci-2']);
        },
        (error: any) => {
            console.error('Erro ao cadastrar:', error);
        }
    );
}

async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: ['OK']
    });

    await alert.present();
}
}