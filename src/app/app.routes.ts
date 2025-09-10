import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  // Cadastro
  {
    path: 'cadastro',
    loadComponent: () => import('./cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'questionario',
    loadComponent: () => import('./questionario/questionario.page').then( m => m.QuestionarioPage)
  },

  
  //Login 
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Esqueci Minha Senha
  {
    path: 'esqueci-minha-senha',
    loadComponent: () => import('./esqueciSenha/esqueci-minha-senha/esqueci-minha-senha.page').then( m => m.EsqueciMinhaSenhaPage)
  },
  {
    path: 'esqueci-2',
    loadComponent: () => import('./esqueciSenha/esqueci-2/esqueci-2.page').then( m => m.Esqueci2Page)
  },
  {
    path: 'esqueci-3',
    loadComponent: () => import('./esqueciSenha/esqueci-3/esqueci-3.page').then( m => m.Esqueci3Page)
  },


  // Pagina do Projeto
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./feed/feed.page').then( m => m.FeedPage)
      },
      {
        path: 'alarms',
        loadComponent: () => import('./alarms/alarms.page').then( m => m.AlarmsPage)
        // canActivate: [authGuard]
      },
      {
        path: 'quests',
        loadComponent: () => import('./quests/quests.page').then( m => m.QuestsPage)
        // canActivate: [authGuard]
      },
      {
        path: 'user',
        loadComponent: () => import('./user/user.page').then( m => m.UserPage)
        // canActivate: [authGuard]
      },
    ]
  },
];