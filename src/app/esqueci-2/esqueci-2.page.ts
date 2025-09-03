import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonInputOtp, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonCardSubtitle } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';
import { AlertController } from '@ionic/angular';
import { RequisicaoService } from '../service/requisicao.service';

@Component({
  selector: 'app-esqueci-2',
  templateUrl: './esqueci-2.page.html',
  styleUrls: ['./esqueci-2.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, RouterLink, IonTitle, IonToolbar, IonImg, IonInputOtp, IonCard, IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, IonCardSubtitle, CommonModule, FormsModule]
})
export class Esqueci2Page implements OnInit {
  public codigo:string = '';
  public erroCamposVazios:string = ''
  public erroCodigoNaoExiste:string = ''

  constructor(private alertController: AlertController,
    public autenticacao_service:AutenticacaoService,
    public rs:RequisicaoService,
    private router: Router) { }

  ngOnInit() {
  }

  proximo() {
    this.erroCamposVazios = '';
    this.erroCodigoNaoExiste = '';

    if (!this.codigo) {
        this.presentAlert('Erro', 'Por favor, preencha o campo de e-mail para continuar.');
        return;
    }

    const fd = new FormData();
    fd.append('controller', 'proximo');
    fd.append('codigo', this.codigo);

    this.rs.post(fd).subscribe(
        (response: any) => {
            console.log('a', response);
            this.router.navigate(['/esqueci-2']);
        },
        (error: any) => {
            console.error('Erro ao verificar o código:', error);
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
