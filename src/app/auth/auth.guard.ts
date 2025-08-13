import { CanActivateFn, Router } from '@angular/router';
import { AutenticacaoService } from '../service/autenticacao.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const autenticacao_service = inject(AutenticacaoService);
  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  //Redireciona para página de login caso o token não exista
  if(token == '' || token == null || token == undefined){
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};
