import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'esqueci-minha-senha',
    loadComponent: () => import('./esqueci-minha-senha/esqueci-minha-senha.page').then( m => m.EsqueciMinhaSenhaPage)
  },

  {
    path: 'esqueci-2',
    loadComponent: () => import('./esqueci-2/esqueci-2.page').then( m => m.Esqueci2Page)
  },
  
];