import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { RealtimeDatabaseService } from '../firebase/realtime-database';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TimeCheckerService {
  public dados: Array<any> = [];
  public alarmes: Array<any> = [];
  public userId: string = localStorage.getItem('userId') || '';

  private currentTimeSource = new BehaviorSubject<Date>(new Date());
  public currentTime$ = this.currentTimeSource.asObservable();

  constructor(
    public rt: RealtimeDatabaseService,
    private router: Router
  ) {
    // Atualiza o horário a cada minuto
    interval(60000).subscribe(() => {
      const now = new Date();
      this.currentTimeSource.next(now);
      this.verificarAlarmes(now);
    });

    // Atualiza no início
    const now = new Date();
    this.currentTimeSource.next(now);
    this.load();
    this.verificarAlarmes(now);
  }

  load() {
    this.rt.query('/alarme', (snapshot: any) => {
      if (snapshot.val() !== null) {
        this.dados = Object.entries(snapshot.val()).map(([key, item]: [string, any]) => {
          item.id = key;
          item.alarmes = Array.isArray(item.alarmes) ? item.alarmes : [];
          return item;
        }).filter((item: any) => item.user === this.userId);

        // Extrai todos os alarmes em um array só
        this.alarmes = [];
        this.dados.forEach((item: any) => {
          if (Array.isArray(item.alarmes)) {
            const alarmesComId = item.alarmes.map((alarme: any, index: number) => ({
              ...alarme,
              idDoDado: Number(item.id),              // ID do "pai"
              idAlarme: Number(index+1) // ID do alarme (gera um se não tiver)
            }));
            this.alarmes.push(...alarmesComId);
          }
        });
      } else {
        this.dados = [];
        this.alarmes = [];
      }
    });
  }

  verificarAlarmes(now: Date) {
    const horaAtual = now.toTimeString().slice(0, 5);

    this.alarmes.forEach((alarme: any) => {
      const horaDoAlarme = alarme.hora || alarme.horario || alarme.horarioInicio;

      if (alarme.ativo && horaDoAlarme === horaAtual){
        console.log(`🚨 Alarme disparado:`, alarme);

        localStorage.setItem('idAlarme', alarme.idDoDado);
        localStorage.setItem('idAlarmeEspecifico', alarme.idAlarme);
        this.router.navigate([`/alarme-tocando/`]);
      };
    });
  }
}
