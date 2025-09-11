import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonText, IonCard, IonButton, IonCardContent, IonToolbar, IonButtons, IonGrid, IonRow, IonCol, IonDatetime, IonRange } from '@ionic/angular/standalone';

@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [IonRange, IonDatetime, IonCardContent, IonButton, IonCard, IonText, IonContent, CommonModule, FormsModule]
})
export class NewAlarmPage implements OnInit {
  showDetailed: boolean = false;
  rangeText: string = '00:00 - 00:00';

  constructor() { }

  ngOnInit() {
  }

  toggleView() {
    this.showDetailed = !this.showDetailed;
  }

  onRangeChange(event: any) {
    const lowerValue = event.detail.value.lower;
    const upperValue = event.detail.value.upper;
    
    // A função formatTime já existe no seu código, vamos reutilizá-la
    const startTime = this.formatTime(lowerValue);
    const endTime = this.formatTime(upperValue);

    this.rangeText = `${startTime} - ${endTime}`;
  }

  // Nova função para formatar o valor do pino
  formatPinTime = (value: number) => {
    const hours = Math.floor(value / 60).toString().padStart(2, '0');
    const minutes = (value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Função auxiliar que você já tem no seu código
  formatTime(value: number) {
    const hours = Math.floor(value / 60).toString().padStart(2, '0');
    const minutes = (value % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  salvar(){}

  excluir(){}

}
