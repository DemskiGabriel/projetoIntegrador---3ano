import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonInput, IonItem, IonButton, IonImg, IonIcon } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { AutenticacaoService } from '../service/autenticacao.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonImg, IonCard, RouterLink,  IonCardHeader, IonCardTitle,  IonCardContent, IonInput, IonItem, IonButton, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  public login: string = '';
  public senha: string = '';

  constructor(private alertController: AlertController, private router: Router) {}

  ngOnInit() {}

  async logar() {
    if (!this.login || !this.senha) {
      const alert = await this.alertController.create({
        header: 'Atenção',
        message: 'Por favor, preencha todos os campos!',
        buttons: ['OK'],
      });
      await alert.present();
      return;
    }

    console.log('Tentando logar com:', this.login, 'e', this.senha);
    this.router.navigate(['/tabs/user']);
  }
}