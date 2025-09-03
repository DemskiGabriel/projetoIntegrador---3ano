import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonImg 
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-no-missions',
  templateUrl: './semmissao.page.html',
  styleUrls: ['./semmissao.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonImg 
  ]
})
export class SemmissaoPage implements OnInit {

  constructor() { }

  ngOnInit() {
   
  }

}