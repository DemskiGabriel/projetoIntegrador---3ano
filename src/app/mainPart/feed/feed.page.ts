import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonInput, IonButton, IonCard, IonIcon, IonItem } from '@ionic/angular/standalone';

interface Task {
  title: string;
  points: number;
  image: string;
  time: string;
  status: string;
  cardColor: string;
}

@Component({
  selector: 'app-missions',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonItem, IonIcon, IonCard, IonButton, IonInput, IonLabel, CommonModule, FormsModule, IonContent]
})
export class FeedPage implements OnInit {
  public usuario:string = 'Gabriel';
  
  constructor(){}
  ngOnInit() {}
}