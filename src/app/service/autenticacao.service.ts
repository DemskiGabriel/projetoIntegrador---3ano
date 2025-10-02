import { Injectable } from '@angular/core';
import { RequisicaoService } from './requisicao.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(
    public rs:RequisicaoService
  ) { }
  
  logar(email:string, password:string){
    const fd = new FormData();
    fd.append('controller', 'logar');
    fd.append('email', email);
    fd.append('password', password);

    return this.rs
    .post(fd);
  }

  //Chama as informações do usuario para a edição de perfil.
  edicaoUsuario(id:string){
    const fd = new FormData();
    fd.append('controller', 'dadosUsuario')
    fd.append('id', id);

    return this.rs
    .post(fd);
  }

  // Faz update no usuario que esta na edição de perfil.
  updateUsuario(id:string, nome:string, email:string, descricao:string, dataNascimento:string, image?: File){
    const fd = new FormData();
    fd.append('controller', 'atualizarUsuario');
    fd.append('id', id);
    fd.append('nome', nome);
    fd.append('email', email);
    fd.append('descricao', descricao);
    fd.append('dataNascimento', dataNascimento);
  
    if(image){
      fd.append('image', image, image.name);
    }
  
    return this.rs.post(fd);
  }

  rank(){
    const fd = new FormData();
    fd.append('controller', 'rank');
  
    return this.rs.post(fd); // usa POST igual ao resto
  }
  


  proximo(email:string){
    const fd = new FormData();
    fd.append('controller', 'proximo');
    fd.append('email', email);

    return this.rs
    .post(fd);
  }

  validarToken(_token:string){
    const fd = new FormData();
    fd.append('controller', 'validar-token');
    fd.append('token', _token);

    return this.rs.post(fd);
  }
}
