import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonCard, IonIcon, IonItem, IonImg, IonLabel, IonContent, IonFab, IonFabButton, IonCardContent } from '@ionic/angular/standalone';

import '@ionic/core/css/core.css';

import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';
import { RouterLink } from '@angular/router';
import { AutenticacaoService } from 'src/app/service/autenticacao.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonFabButton, IonFab,  IonIcon, IonCard, IonItem, IonLabel, IonImg, CommonModule, FormsModule, IonContent, RouterLink]
})
export class PerfilPage implements OnInit {
  public perfil: string = 'perfil';
  
  public amigos: string = 'amigos'

  constructor(
    public autenticacao_service:AutenticacaoService,
  ) { }

  ngOnInit() {
    this.load();
  }

  // ---------- Load ----------
  // Pega os dados do banco de dados e os carrega na pagina.
  public id:string = localStorage.getItem('userId') || '';

  public nome:string = '';
  public email:string = '';
  public descricao:string = '';
  public dataNascimento:string = '';
  public pontos:number = 0;

  // foto de perfil base
  fotoPerfil: string = "assets/icon/fotodeperfil.png";

  load(){
    this.autenticacao_service
    .edicaoUsuario(this.id)
    .subscribe(
      (_res:any) => {
        if (_res.status == 'success'){
          this.nome = _res.dados.username ?? this.nome;
          this.email = _res.dados.email ?? this.email;
          this.descricao = _res.dados.descricao ?? this.descricao;
          this.pontos = _res.dados.pontos ?? this.pontos;

          this.fotoPerfil = _res.dados.imgPerfil 
                              ? 'http://localhost/projetoIntegrador/' + _res.dados.imgPerfil 
                              : this.fotoPerfil;

          this.formatarDataLoad(_res.dados.birthday);
        }else Error
      }
    );
  }

  // formata a data que vem do banco de dados
  formatarDataLoad(data: string) {
    let [ ano, mes, dia] = data.split('-');
    ano = new Date().getFullYear().toString();
    this.dataNascimento = `${dia}/${mes}/${ano}`;
  }
}
