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
  public id:number = 0;

  public nomeAlarme:string = ''; 
  public vezesPorDia:number | null = null;

  public vibracao:boolean = true;
  public somAlarme:boolean = true;

  public calendario:string[] = [];
  public dataAEnviar:string[] = [];
  public tipoData:string = '';
  
  
  constructor(
    public rt: RealtimeDatabaseService,
    private alertController: AlertController,
    private router: Router,
    private ar: ActivatedRoute
  ){
    this.ar.params.subscribe((param:any) => {
      this.id = param.id;
    })  
  }

  ngOnInit() {
    this.load();
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

    for (let i = 0; i < divisoes; i++) {
      const novoHorario = new Date(inicio.getTime() + intervalo * i);

      const horas = novoHorario.getHours().toString().padStart(2, '0');
      const minutos = novoHorario.getMinutes().toString().padStart(2, '0');

      this.horariosAoDia.push({
        hora: `${horas}:${minutos}`,
        ativo: true
      });
    }
    return true;
  }


  // ---------- Salvar ----------
  // faz as verificações necessarias para salvar o alarme
  verificacoes(){
    // Caso calendario não tenha nenhum valor selecionado e dias selicionados tenha, então enviara diasSelecionados
    if(this.calendario.length == 0 && this.diasSelecionados.length > 0){
      this.dataAEnviar = this.diasSelecionados.map(String);
      this.tipoData = 'dias';
    }
    // Caso calendario tenha algum valor e dias selecionados não, então enviara calendario
    if(this.calendario.length > 0 && this.diasSelecionados.length == 0){
      this.dataAEnviar = this.calendario;
      this.tipoData = 'calendario';
    }


    // Verifica se Data inicial é maior do que a final.
    if(this.dataSInicial >= this.dataSFinal){
      this.presentAlertFalha();
      return false
    }
    // verifica se algum dos campos não foi preenchido
    else if(this.nomeAlarme == '' || this.vezesPorDia == null){
      this.presentAlertFalha();
      return false;
    }
    // Verifica se alguma data foi selecionada 
    else if(this.tipoData == ''){
      this.presentAlertFalha();
      return false;
    }

    return true
  }
  // Salva o Alarme no banco de dados
  salvar() {
    if(this.verificacoes() && this.gerarVezesAFazer()){
      this.rt.add(`/tarefa`,{
        nomeAlarme: this.nomeAlarme,
        vezesPorDia: this.vezesPorDia,
        vibracao: this.vibracao,
        somAlarme: this.somAlarme,
        dias: this.dataAEnviar,
        tipoData: this.tipoData,
        alarmes: this.horariosAoDia,
        horarioInicio: this.dataSInicial,
        horarioFinal: this.dataSFinal,
        ativo: true
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
  // Alerta quando a falha para salvar
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

  // Configura o botão de Salvar o Calendario 
  @ViewChild('datetime') datetime:any;
  salvarCalendario() {
    this.datetime.confirm();
    this.showCalendar = false;

    // Zera os valores do dia da semana quando um dia do calendario é clicado
    this.diasSelecionados = [];
  }
  // Configura o botão de para Resetar o calendario
  cancelCalendario() {
    this.datetime.reset();
    this.showCalendar = false;
  }


  // ---------- Load / Excluir ----------
  // Carrega caso o objeto já exista.
  load(){
    this.rt.query(`/tarefa/${this.id}`, (snapshot:any) => {
      const dados = Object(snapshot.val())      
      console.log(dados);
      this.nomeAlarme = dados.nomeAlarme;
      this.vezesPorDia = dados.vezesPorDia;
      this.vibracao = dados.vibracao;
      this.somAlarme = dados.somAlarme;
      this.dataAEnviar = dados.dias;
      this.tipoData = dados.tipoData;
      this.dataSInicial = dados.horarioInicio;
      this.dataSFinal = dados.horarioFinal

      this.configData(dados)
    })
  }

  // Exclui o Alarme caso ele já exista
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
            this.rt.remove(`/tarefa/${this.id}`).then();
            this.router.navigate(['/tabs/alarms']);
          },
        },
      ],
    });
    await alert.present();
  }

  configData(dados: any){
    // Caso forem enviados dias da semana para o banco de dados, convertera para os dias
    if(dados.tipoData == 'dias'){
      this.diasSelecionados = this.dataAEnviar.map(Number);
    }
    //Caso forem enviadas datas para o banco de dados convertera na datas 
    else if(dados.tipoData == 'calendario'){
      this.calendario = this.dataAEnviar;
    }
  }
}
