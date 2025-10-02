import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonInput, IonButton, IonButtons, IonAvatar, IonCard, IonTextarea, IonIcon } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { AutenticacaoService } from 'src/app/service/autenticacao.service';

@Component({
  selector: 'app-changeprofile',
  templateUrl: './changeprofile.page.html',
  styleUrls: ['./changeprofile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonTextarea, IonCard, IonContent, CommonModule, FormsModule, IonInput, IonButton, IonButtons, IonAvatar, RouterLink]
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

  // Converte a data do formato DD/MM/YYYY para YYYY-MM-DD
  converterDataParaBanco(data: string): string {
  const partes = data.split('/');
  if (partes.length !== 3) return data; // se não tiver formato esperado, retorna como está

  const [dia, mes, ano] = partes;
  return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
  }

  // ---------- Troca de imagem ----------
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  // foto de perfil base
  fotoPerfil: string = "assets/icon/fotodeperfil.png";

  selecionarImagem() {
    this.fileInput.nativeElement.click();
  }

  selectedFile!: File;

  onFileSelected(event: any) {
    const file: File = event.target.files[0];

    if (file) {
      this.selectedFile = file; // salva o File real

      const reader = new FileReader();
      reader.onload = () => {
        this.fotoPerfil = reader.result as string; // só para exibir
      };
      reader.readAsDataURL(file);
    }
  }

  // ---------- Load ----------
  async load() {
    this.autenticacao_service
      .edicaoUsuario(this.id)
      .subscribe(async (_res: any) => {
        if (_res.status == 'success') {
          this.nome = _res.dados.username ?? this.nome;
          this.email = _res.dados.email ?? this.email;
          this.descricao = _res.dados.descricao ?? this.descricao;
          this.dataNascimento = _res.dados.birthday ?? this.dataNascimento;

          // monta a URL da imagem
          this.fotoPerfil = _res.dados.imgPerfil
            ? 'http://localhost/projetoIntegrador/' + _res.dados.imgPerfil
            : this.fotoPerfil;

          this.formatarDataLoad(this.dataNascimento);
        } else {
          console.error("Erro ao carregar usuário");
        }
      });
  }



  // ---------- Save ----------
  save() {
    // Formata a data para o banco
    const dataFormatada = this.converterDataParaBanco(this.dataNascimento);

    this.autenticacao_service
    .updateUsuario(
      this.id, 
      this.nome, 
      this.email, 
      this.descricao, 
      dataFormatada,
      this.selectedFile
    )
    .subscribe((_res: any) => {
      if (_res.status == 'success'){
        console.log(_res.msg);
      } else {
        console.error('Erro ao atualizar usuário');
      }
    });
  }
}
