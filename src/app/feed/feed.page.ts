import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonChip } from '@ionic/angular/standalone';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonChip, IonContent, CommonModule, FormsModule ]
})
export class FeedPage implements OnInit {

  public score:number = 1000

  constructor() { }

  ngOnInit() {
  }
}
