import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonButtons, IonAvatar, IonCard, IonTextarea, IonFab, IonFabButton, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AutenticacaoService } from 'src/app/service/autenticacao.service';

@Component({
  selector: 'app-changeprofile',
  templateUrl: './changeprofile.page.html',
  styleUrls: ['./changeprofile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonFabButton, IonFab, IonTextarea, IonCard, IonContent, CommonModule, FormsModule, IonInput, IonButton, IonButtons, IonAvatar, RouterLink]
})
export class ChangeprofilePage implements OnInit {
  public id:string = localStorage.getItem('userId') || '';

  public nome:string = '';
  public email:string = '';
  public descricao:string = '';
  public dataNascimento: string = '';
  

  constructor(
    public autenticacao_service:AutenticacaoService,
  ) { }

  ngOnInit() {
    this.load();
  }

  // ---------- Data ----------
  // Formata a data inserida no campo
  formatarData(event: any) {
    let valor = event.detail.value;
    if (!valor) return;

    valor = valor.replace(/\D/g, '');

    if (valor.length > 2 && valor.length <= 4) {
      valor = valor.replace(/(\d{2})(\d+)/, '$1/$2');
    } else if (valor.length > 4) {
      valor = valor.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3');
    }

    event.target.value = valor;
  }

  // formata a data que vem do banco de dados
  formatarDataLoad(data: string) {
    const [ano, mes, dia] = data.split('-');
    this.dataNascimento = `${dia}/${mes}/${ano}`;
  }

  // ---------- Troca de imagem ----------
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  fotoPerfil: string = "assets/icon/fotodeperfil.jpg";

  selecionarImagem() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result as string; // atualiza o avatar
      };
      reader.readAsDataURL(file);
    }
  }
  

  // ---------- Load ----------
  // Pega os dados do banco de dados e os carrega na pagina.
  load(){
    

    this.autenticacao_service
    .edicaoUsuario(this.id)
    .subscribe(
      (_res:any) => {
        if (_res.status == 'success'){
          this.nome = _res.dados.username;
          this.email = _res.dados.email;
          this.descricao = _res.dados.descricao;
          this.dataNascimento = _res.dados.birthday;

          this.formatarDataLoad(this.dataNascimento);
        }else Error
      }
    );
  }

  // ---------- Save ----------
  save(){
    this.autenticacao_service
    .updateUsuario(this.id, this.nome, this.email, this.descricao, this.dataNascimento)
    .subscribe(
      (_res:any) => {
        if (_res.status == 'success'){
          console.log(_res.msg);
        }else Error
      }
    );
  }
}
