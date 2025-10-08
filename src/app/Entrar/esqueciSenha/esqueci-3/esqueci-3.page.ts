import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonInput, IonButton, IonNavLink } from "@ionic/angular/standalone";

@Component({
  selector: 'app-esqueci-3',
  templateUrl: './esqueci-3.page.html',
  styleUrls: ['./esqueci-3.page.scss'],
  standalone: true,
  imports: [IonNavLink, IonButton, IonInput, IonContent, FormsModule, RouterLink ]
})
export class Esqueci3Page{
  public idToken:number = 0;

  criar(){
    if(this.idToken >= 0){
      let id = this.idToken.toString();

      localStorage.setItem('userId', id);

      console.log("Usuario temporario logado com sucesso. ID: " + id);
    }else console.log("Digite um valor de 0 a cima");
  }
}

