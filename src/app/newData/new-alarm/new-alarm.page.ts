import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [IonText, IonContent, CommonModule, FormsModule]
})
export class NewAlarmPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
