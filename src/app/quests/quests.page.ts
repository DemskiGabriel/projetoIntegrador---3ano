import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonChip, IonText, IonTabs, IonTabBar, IonImg, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';

@Component({
  selector: 'app-quests',
  templateUrl: './quests.page.html',
  styleUrls: ['./quests.page.scss'],
  standalone: true,
  imports: [IonLabel, IonIcon, IonTabButton, IonImg, IonTabBar, IonTabs, IonText, IonChip, IonContent, CommonModule, FormsModule]
})
export class QuestsPage implements OnInit {
  public score:number = 1000

  constructor() { }

  ngOnInit() {
  }

}
