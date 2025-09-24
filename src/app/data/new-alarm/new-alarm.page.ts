import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardContent, IonDatetime, IonButton, IonInput, IonItem, IonIcon, IonButtons, IonModal, IonToggle, IonFab, IonFabButton, IonTextarea } from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';
import { RealtimeDatabaseService } from 'src/app/firebase/realtime-database';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-new-alarm',
  templateUrl: './new-alarm.page.html',
  styleUrls: ['./new-alarm.page.scss'],
  standalone: true,
  imports: [IonTextarea, IonToggle, IonModal, IonButtons, IonIcon, IonItem, IonInput, IonButton, CommonModule, FormsModule, IonDatetime, IonCardContent, IonCard, IonContent, RouterLink ]
})
export class NewAlarmPage {
  public idAlarme:number = 0;
  public idUsuario:string = localStorage.getItem('userId') || '';

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
    private ar: ActivatedRoute,
    public http: HttpClient,
  ){
    // pega o id da url caso exista
    this.ar.params.subscribe((param:any) => {
      this.idAlarme = param.idAlarme;
    })   
  }

  ngOnInit() {
    this.load();
  }

  // ---------- Datetime ----------
  // Horario padrão que os seletores de tempo virão
  public dataSInicial:string = '06:30'; 
  public dataSFinal:string = '22:30';
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

  // ---------- Divisão De horarios ----------
  // calcula os horarios que deve ter os alarmes e então retorna o valor em uma array "horariosAoDia[]"
  public horariosAoDia: { hora: string, ativo: boolean }[] = [];

  private parseTimeToDate(value: string): Date | null {
    if (!value) return null;
  
    // 1) Caso já seja "HH:mm"
    const hm = value.match(/^(\d{1,2}):(\d{2})$/);
    if (hm) {
      const h = Number(hm[1]), m = Number(hm[2]);
      return new Date(2025, 0, 1, h, m, 0, 0); // dia-base arbitrário (mesma base usada no resto)
    }
  
    // 2) Caso seja ISO (ex: "2025-09-22T08:30:00.000Z" ou "2025-09-22T08:30:00")
    const isoMatch = value.match(/\d{4}-\d{2}-\d{2}T(\d{2}):(\d{2})/);
    if (isoMatch) {
      const h = Number(isoMatch[1]), m = Number(isoMatch[2]);
      return new Date(2025, 0, 1, h, m, 0, 0); // cria no horário LOCAL com os mesmos H/M
    }
  
    // 3) fallback: tenta criar Date e extrair horas/minutos (menos preferível)
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return new Date(2025, 0, 1, d.getHours(), d.getMinutes(), 0, 0);
    }
  
    return null;
  }
  gerarVezesAFazer(): boolean {
    this.horariosAoDia = [];
  
    const divisoes = Number(this.vezesPorDia) || 0;
    if (!divisoes || divisoes <= 0) {
      console.warn("Número de vezes por dia inválido.");
      return false;
    }
  
    const inicio = this.parseTimeToDate(this.dataSInicial);
    const fim = this.parseTimeToDate(this.dataSFinal);
  
    console.log('raw inicio:', this.dataSInicial, 'parsed inicio:', inicio);
    console.log('raw fim:', this.dataSFinal, 'parsed fim:', fim);
  
    if (!inicio || !fim) {
      console.warn("Datas de início ou fim inválidas (não foi possível parsear).");
      return false;
    }
  
    // Se o fim for igual ou antes do início, assumimos que é no dia seguinte
    let fimAdj = new Date(fim.getTime());
    if (fimAdj.getTime() <= inicio.getTime()) {
      // opcional: comentar essa linha se você quiser forçar erro em vez de assumir próximo dia
      fimAdj = new Date(fimAdj.getTime() + 24 * 60 * 60 * 1000);
      console.warn("Horário final <= início — assumindo horário final no dia seguinte.");
    }
  
    const diferencaTotal = fimAdj.getTime() - inicio.getTime();
    if (diferencaTotal <= 0) {
      console.warn("Horário final precisa ser depois do inicial.");
      return false;
    }
  
    const intervalo = diferencaTotal / divisoes;
    const intervaloMinimo = 1 * 60 * 1000;
    if (intervalo < intervaloMinimo) {
      console.warn("Intervalo menor que 1 minutos.");
      return false;
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
  // Salva o Alarme no banco de dados
  salvar() {
    if(this.verificacoes() && this.gerarVezesAFazer()){
      this.rt.add(`/alarme`,{
        // Id Do usuario.
        user: this.idUsuario,
        
        nomeAlarme: this.nomeAlarme,
        horarioInicio: this.dataSInicial,
        horarioFinal: this.dataSFinal,
        vezesPorDia: this.vezesPorDia,
        vibracao: this.vibracao,
        somAlarme: this.somAlarme,

        // Dias se refere aos dias que o alarme sera desparado.
        dias: this.dataAEnviar,
        // Tipo Data referesse a se o tipo de dias é uma data do calendario ou são dias da semana.
        tipoData: this.tipoData,
        // Alarmes referesse a lista de vezes que o alarme dispertara em um dia.
        alarmes: this.horariosAoDia,
        // Ativo referesse se o alarme esta ativo ou não.
        ativo: true, 

        // Modo desafio(Caso ativo)
        modoDesafio: this.desafioToggle,
        descricaoDesafio: this.descricaoDesafio,
      }, this.idAlarme)
      .subscribe({
        next: (idDoAlarme) => {
          this.idAlarme = idDoAlarme;
          // Verifica se o "modo Desafio" esta ativo, se sim ele cria os desafios, caso não o codigo se segue normalmente
          if(this.desafioToggle == true) this.generateDesafios();

          this.presentAlertSucesso();
        },
        error: (err) => {
          console.log('Falhou ', err);
        }
      });
    }
  }
  // faz as verificações necessarias para salvar o alarme
  verificacoes(){
    let res;
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
      res = "Data impossivel. Corrija"
      this.presentAlertFalha(res);
      return false
    }
    // verifica se algum dos campos não foi preenchido
    else if(this.nomeAlarme == '' || this.vezesPorDia == null){
      res = "por favor preencha todos os campos"
      this.presentAlertFalha(res);
      return false;
    }
    // Verifica se alguma data foi selecionada 
    else if(this.tipoData == ''){
      res = "por favor adicione um tipo de data"
      this.presentAlertFalha(res);
      return false;
    }

    // Verifica se o "Modo Desafio" esta ativo, se sim, verifica se foi escrita alguma descrição
    if(this.desafioToggle == true && this.descricaoDesafio == ''){
      res = "por favor adicione uma descrição"
      this.presentAlertFalha(res);
      return false;
    }
    // Caso tudo de certo retorna verdadeiro e o processo de salvamento continua.
    return true
  }

  // ---------- Alertas ----------
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
  async presentAlertFalha(res:string) {
    const alert = await this.alertController.create({
      header: 'FALHA AO SALVAR',
      message: `Erro, ${res} para poder salvar. Precione "OK" para voltar.`,
      buttons: [{
          text: 'OK',
          role: 'confirm',
        }],
    });
    await alert.present();
  }


  // ---------- Load / Excluir ----------
  // Carrega caso o objeto já exista.
  load(){
    this.rt.query(`/alarme/${this.idAlarme}`, (snapshot:any) => {
      const dados = Object(snapshot.val()) 
      this.idDesafio = dados.idDesafio ?? this.idDesafio;
    
      this.desafioToggle = dados.modoDesafio ?? this.desafioToggle;
      this.descricaoDesafio = dados.descricaoDesafio ?? this.descricaoDesafio;

      this.nomeAlarme = dados.nomeAlarme ?? this.nomeAlarme;
      this.dataSInicial = dados.horarioInicio ?? this.dataSInicial;
      this.dataSFinal = dados.horarioFinal ?? this.dataSFinal;
      this.vezesPorDia = dados.vezesPorDia ?? this.vezesPorDia;

      // Configura calendario ou os dias da semana dependendo de qual esta no tipo de data.
      this.tipoData = dados.tipoData ?? this.tipoData;
      this.dataAEnviar = dados.dias ?? this.dataAEnviar;

      this.vibracao = dados.vibracao ?? this.vibracao;
      this.somAlarme = dados.somAlarme ?? this.somAlarme;
      
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
            this.rt.remove(`/tarefa/${this.idAlarme}`).then();
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

  // ---------- Modo Desafio ----------
  public desafioToggle:boolean = false;
  public descricaoDesafio:string = '';

  // ---------- IA ----------
  public idDesafio:number = 0;

  // URL da API Gemini
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
  // API Key do Gemini for Goole Cloud API
  private apiKey = 'AIzaSyDUYCt26CQ7Zg2jJQPckE671U4ANImZr3s';

  generateDesafios(){
    // Configuração dos headers para a requisição HTTP
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-goog-api-key': this.apiKey
    });
    // Corpo da requisição com o prompt para a IA
    const body = {
      contents: [
        {
          parts: [
            {
              text: `Gere 3 missões de nivel mediano com pontuações para uma rotina de alarme, com as seguintes informações: Descrição do alarme: ${this.descricaoDesafio}; Quantidade de repetições: ${this.vezesPorDia}; Horário de início: ${this.dataSInicial}; Horário final: ${this.dataSFinal}.`
            },
            {
              text: `exemplos de missão, Completar o alarme todas as vezes ao dia, completar 5 alarmes seguidos, fazer registro de 3 alarmes quando os completar.
              outros também podem ter haver com sobre oque o alarme é.`
            }
          ]
        }
      ],
      generationConfig: {
        thinkingConfig: {
          thinkingBudget: 5
        },
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              titulo: {
                type: "STRING"
              },
              descricao: {
                type: "STRING"
              },
              pontos: {
                type: "INTEGER"
              }
            },
          }
        }
      }      
    };

    this.http.post(this.apiUrl, body, { headers: headers })
    .subscribe({
      next: (response:any) => {
        // Processa a resposta e atualiza as vendas projetadas
        if (response && response.candidates && response.candidates.length > 0) {
          const parts = response.candidates[0].content.parts;
          if (parts && parts.length > 0 && parts[0].text) {
            // Atualiza as vendas projetadas com os dados retornados pela IA
            console.log(JSON.parse(parts[0].text));
            this.salvarMissao(JSON.parse(parts[0].text));
          }
        }
      }
    });
  }

  salvarMissao(missao:any){
    // Adiciona o campo "completo": false em cada missão
    const missoesAjustadas = missao.map((m:any) => ({
      ...m,
      completo: false
    }));
    
  
    if(this.desafioToggle == true){
      this.rt.add(`/missoes`, {
        idUsuario: this.idUsuario,
        idAlarme: this.idAlarme,
        missoes: missoesAjustadas, 
      }, this.idDesafio)
      .subscribe({
        next: (res:any) => {
          console.log('Missões salvas com sucesso:', res);
        },
        error: (err) => {
          console.log('Falhou ', err);
        }
      });
    }
  }
}