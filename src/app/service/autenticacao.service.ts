import { Injectable } from '@angular/core';
import { RequisicaoService } from './requisicao.service';

@Injectable({
  providedIn: 'root'
})
export class AutenticacaoService {

  constructor(
    public rs: RequisicaoService
  ) { }

  logar(login:string,senha:string){

    const fd = new FormData();
    fd.append('controller','logar');
    fd.append('login',login);
    fd.append('senha',senha);

    return this.rs
    .post(fd);
  }

  validarToken(_token:string){
    return this.rs.get({
      controller:'validar-token',
      token:_token
    })
  }
}
