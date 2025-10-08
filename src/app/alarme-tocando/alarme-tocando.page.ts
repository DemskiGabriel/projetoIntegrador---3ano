import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonFabButton, IonFab, IonButton, IonBackButton } from '@ionic/angular/standalone';
import { RealtimeDatabaseService } from '../firebase/realtime-database';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alarme-tocando',
  templateUrl: './alarme-tocando.page.html',
  styleUrls: ['./alarme-tocando.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonButton, IonFab, IonFabButton, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AlarmeTocandoPage{
  constructor(
    public rt: RealtimeDatabaseService,
    public router: Router
  ) { }
  ionViewWillEnter(){
    this.load();
  }
  
  // ---------- DESATIVAR ALARME ----------
  public idAlarme:number = Number(localStorage.getItem('idAlarme')) || 0;
  public idAlarmeEspecifico:number = Number(localStorage.getItem('idAlarmeEspecifico')) || 0;
  alarmeCompleto(){
    localStorage.setItem('idAlarme', "");
    localStorage.setItem('idAlarmeEspecifico', "");

    this.rt.update(`/alarme/${this.idAlarme}/alarmes/${this.idAlarmeEspecifico}`, { ativo: false, hora: this.horario })
          .then(() => {
            console.log('✅ Alarme desativado')
            this.router.navigate([`/tabs/feed`]);
          })
          .catch(err => console.error('Erro ao atualizar alarme:', err));
  }

  // ---------- LOAD ----------
  public dados: Array<any> = [];
  public titulo:string = '';
  public horario:string = '';
  public completo:boolean = false;
  load() {
    this.rt.query(`/alarme/${this.idAlarme}`, (snapshot:any) => {
      const dados = Object(snapshot.val()) 
      this.titulo = dados.nomeAlarme ?? this.titulo;
      this.horario = dados.alarmes[this.idAlarmeEspecifico].hora ?? this.horario;
      this.completo = dados.alarmes[this.idAlarmeEspecifico].ativo ?? this.completo;
    })
  }
}
