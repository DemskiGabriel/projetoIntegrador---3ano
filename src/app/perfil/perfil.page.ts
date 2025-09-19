import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonCard, IonIcon,IonTab, IonTabBar,IonFab, IonFabButton, IonTabs, IonTabButton, IonList, IonItem, IonToolbar,IonImg, IonLabel } from '@ionic/angular/standalone';
import { defineCustomElements } from '@ionic/core/loader';
import { Router, RouterLink } from '@angular/router';
import { RequisicaoService } from '../service/requisicao.service';

import { addIcons } from 'ionicons';

import '@ionic/core/css/core.css';

import '@ionic/core/css/normalize.css';
import '@ionic/core/css/structure.css';
import '@ionic/core/css/typography.css';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar,IonList,RouterLink, IonTab, IonTabBar, IonTabs, IonFab, IonFabButton, IonTabButton, IonIcon, IonCard, IonItem, IonLabel, IonImg, CommonModule, FormsModule]
})
export class PerfilPage implements OnInit {
  public nome: any[] = [];
  public usuario_logado: any; // Adicione esta variável

  constructor(private requisicaoService: RequisicaoService) { }

  ngOnInit() {
    
  }
}
