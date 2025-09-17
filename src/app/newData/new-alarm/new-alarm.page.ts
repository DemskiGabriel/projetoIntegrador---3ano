import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonDatetime, IonButton, IonInput, IonItem, IonIcon, IonButtons, IonModal, IonToggle, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from 'src/app/firebase/realtime-database';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [IonFabButton, IonFab,  IonToggle, IonModal, IonButtons, IonIcon, IonItem, IonInput, IonButton, CommonModule, FormsModule, IonDatetime, IonCardContent, IonCard, IonContent, RouterLink ]
})
export class NewAlarmPage {
  public idVerificacao:string | null = null;

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
    private route: ActivatedRoute
  ){}

  ngOnInit() {
    this.load();
    this.idVerificacao = this.route.snapshot.paramMap.get('id'); 
  }

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

  // ---------- Divisão De horarios ----------
// calcula os horarios que deve ter os alarmes e então retorna o valor em uma array "horariosAoDia[]"
public horariosAoDia: { hora: string, ativo: boolean }[] = [];

gerarVezesAFazer() {
  this.horariosAoDia = [];

  const divisoes = this.vezesPorDia || 0;

  const inicio = new Date(`2025-01-01T${this.dataSInicial}:00`);
  const fim = new Date(`2025-01-01T${this.dataSFinal}:00`);

  const diferencaTotal = fim.getTime() - inicio.getTime();

  // calcula intervalo bruto
  const intervalo = diferencaTotal / divisoes;

  // mínimo de 10 minutos em ms
  const intervaloMinimo = 10 * 60 * 1000;

  if (intervalo < intervaloMinimo) {
    console.warn(" Número de divisões é grande demais! Intervalo ficaria menor que 10 minutos.");
    return false; // não gera nada
  }

  for (let i = 0; i <= divisoes; i++) {
    const novoHorario = new Date(inicio.getTime() + intervalo * i);

    const horas = novoHorario.getHours().toString().padStart(2, '0');
    const minutos = novoHorario.getMinutes().toString().padStart(2, '0');

    this.horariosAoDia.push({
      hora: `${horas}:${minutos}`,
      ativo: true
    });
  }

  console.log(this.horariosAoDia);
  return true;
}


  // ---------- Salvar / Excluir ----------
  // Carrega caso o objeto já exista.
  public id:number = 0;
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
      this.presentAlertFalha();
      return false
    }
    // verifica se algum dos campos não foi preenchido
    if(this.nomeAlarme == '' || this.vezesPorDia == null){
      this.presentAlertFalha();
      return false;
    }
    return true
  }

  salvar() {
    if(this.verificacoes() && this.gerarVezesAFazer()){
      this.rt.add(`/criar-tarefa`,{
        nomeAlarme: this.nomeAlarme,
        vezesPorDia: this.vezesPorDia,
        vibracao: this.vibracao,
        somAlarme: this.somAlarme,
        dias: this.dataAEnviar,
        alarmes: this.horariosAoDia,
        horarioInicio: this.dataSInicial,
        horarioFinal: this.dataSFinal
      }, this.id)
      .subscribe({
        next: (res:any) => {
          console.log(res);
          this.presentAlertSucesso();
        },
        error: (err) => {
          console.log('Falhou ', err);
        }
      });
    }
  }
  // Alerta quando o projeto é salvo
  async presentAlertSucesso() {
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
  async presentAlertFalha() {
    const alert = await this.alertController.create({
      header: 'FALHA AO SALVAR',
      message: 'Favor preencha os campos corretamente os campos, para poder salvar. Precione "OK" para voltar.',
      buttons: [{
          text: 'OK',
          role: 'confirm',
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
