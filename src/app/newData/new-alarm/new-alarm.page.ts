import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonDatetime, IonButton, IonInput, IonItem, IonIcon, IonButtons, IonModal, IonToggle } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from 'src/app/firebase/realtime-database';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [ IonToggle, IonModal, IonButtons, IonIcon, IonItem, IonInput, IonButton, CommonModule, FormsModule, IonDatetime, IonCardContent, IonCard, IonContent ]
})
export class NewAlarmPage {
  public nomeAlarme:string = ''; 
  public vezesPorDia:number | null = null;
  public vibracao:boolean = true;
  public somAlarme:boolean = true;
  public calendario:string[] = [];
  public dataAEnviar:string[] = [];
  
  constructor(
    public rt: RealtimeDatabaseService,
    private alertController: AlertController,
    private router: Router,
  ){}

  // ---------- Datetime ----------
  // Horario padrão que os seletores de tempo virão
  public dataSInicial:string = '06:30'; 
  public dataSFinal:string = '18:30';
  
  // Monta os botões de seleçõa de dia
  dias = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  diasSelecionados: number[] = []; 

  toggleDia(index: number) {
    // Zera os valores do calendario quando um dia da semana é clicado
    this.calendario = [];

    const i = this.diasSelecionados.indexOf(index);
    if (i > -1) {
      this.diasSelecionados.splice(i, 1);
    } else {
      this.diasSelecionados.push(index);
    }
  }

  // Faz com que a data minima do calendario seja hoje
  minDate: string = new Date().toISOString().split('T')[0];
  showCalendar = false;

  // ---------- Salvar / Excluir ----------
  public id:number = 0;

  // Carrega caso o objeto já exista.
  ngOnInit() {
    this.load();
  }
  load(){
    // Mudar o Caminho do Banco
    this.rt.query(`/new-alarm/${this.id}`, (snapshot:any) => {
      const dados = Object(snapshot.val())
      this.nomeAlarme = dados.nomeAlarme;
      this.vezesPorDia = dados.vezesPorDia;
      this.vibracao = dados.vibracao;
      this.somAlarme = dados.somAlarme;
      // Falta adicionar os que falam o periodo de tempo
    })
  }

  verificacoes(){
    // Caso a data não tenha sido definida define ela para '-1' que significara hoje.
    if(this.calendario.length == 0 && this.diasSelecionados.length == 0){
      this.dataAEnviar = ['-1'];
    }
    // Caso calendario não tenha nenhum valor selecionado e dias selicionados tenha, então enviara diasSelecionados
    if(this.calendario.length == 0 && this.diasSelecionados.length > 0){
      this.dataAEnviar = this.diasSelecionados.map(String);
    }
    // Caso calendario tenha algum valor e dias selecionados não, então enviara calendario
    if(this.calendario.length > 0 && this.diasSelecionados.length == 0){
      this.dataAEnviar = this.calendario;
    }

    // Verifica se Data inicial é maior do que a final.
    if(this.dataSInicial >= this.dataSFinal){
      return false
    }
    // verifica se algum dos campos não foi preenchido
    if(this.nomeAlarme == '' || this.vezesPorDia == null){
      return false;
    }
    return true
  }
  salvar() {
    if(this.verificacoes()){
      this.rt.add(`/criar-tarefa`,{
        nomeAlarme: this.nomeAlarme,
        vezesPorDia: this.vezesPorDia,
        vibracao: this.vibracao,
        somAlarme: this.somAlarme,
        dias: this.dataAEnviar
      }, this.id)
      .subscribe({
        next: (res:any) => {
          console.log(res);
          this.presentAlert();
        },
        error: (err) => {
          console.log('Falhou ', err);
        }
      });
    }
  }
  // Alerta quando o projeto é salvo
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'SALVO COM SUCESSO',
      message: 'Precione "OK" para continuar.',
      buttons: [{
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.router.navigate(['/tabs/alarms']);
          } 
        }],
    });
    await alert.present();
  }

  
  

  async excluir() {
    const alert = await this.alertController.create({
      header: 'TEM CERTEZA QUE DESEJA DELETAR?',
      message: 'Essa ação não poderá ser desfeita',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'DELETE',
          role: 'confirm',
          handler: () => {
            // Mudar o Caminho do Banco
            this.rt.remove(`/new-alarm/${this.id}`).then();
          },
        },
      ],
    });
    await alert.present();
  }


  @ViewChild('datetime') datetime:any;
  salvarCalendario() {
    this.datetime.confirm();
    this.showCalendar = false;

    // Zera os valores do dia da semana quando um dia do calendario é clicado
    this.diasSelecionados = [];
  }
  cancelCalendario() {
    this.datetime.reset();
    this.showCalendar = false;
  }
}
