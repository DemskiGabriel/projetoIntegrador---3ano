import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonDatetime, IonButton, IonInput, IonItem, IonIcon, IonButtons, IonAlert, IonPopover } from '@ionic/angular/standalone';
import { PopoverController } from '@ionic/angular';


@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [IonPopover, IonButtons, IonIcon, IonItem, IonInput, IonButton, CommonModule, FormsModule, IonDatetime, IonCardContent, IonCard, IonContent ]
})
export class NewAlarmPage {
  // ---------- Accordion Range & Datetime ----------
  startTime = '06:30';
  endTime = '18:30';

  onStartTimeChange(ev: any) {
    this.startTime = ev.detail.value.substring(11, 16);
  }
  onEndTimeChange(ev: any) {
    this.endTime = ev.detail.value.substring(11, 16);
  }


  dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  selecionados: number[] = []; 

  toggleDia(index: number) {
    const i = this.selecionados.indexOf(index);
    if (i > -1) {
      this.selecionados.splice(i, 1);
    } else {
      this.selecionados.push(index);
    }
  }

  // ---------- Salvar / Excluir ----------
  salvar() {
    // lógica de salvar aqui
  }

  excluir() {
    // lógica de excluir aqui
  }
}
