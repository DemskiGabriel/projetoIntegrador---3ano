import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { TabsPage } from './tabs/tabs.page';

export const routes: Routes = [
  // Cadastro
  {
    path: 'cadastro',
    loadComponent: () => import('./Entrar/cadastro/cadastro.page').then( m => m.CadastroPage)
  },
  {
    path: 'questionario',
    loadComponent: () => import('./Entrar/questionario/questionario.page').then( m => m.QuestionarioPage)
  },


  //Login 
  {
    path: 'login',
    loadComponent: () => import('./Entrar/login/login.page').then( m => m.LoginPage)

  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  // Esqueci Minha Senha
  {
    path: 'esqueci-minha-senha',
    loadComponent: () => import('./Entrar/esqueciSenha/esqueci-minha-senha/esqueci-minha-senha.page').then( m => m.EsqueciMinhaSenhaPage)
  },
  {
    path: 'esqueci-2',
    loadComponent: () => import('./Entrar/esqueciSenha/esqueci-2/esqueci-2.page').then( m => m.Esqueci2Page)
  },
  {
    path: 'esqueci-3',
    loadComponent: () => import('./Entrar/esqueciSenha/esqueci-3/esqueci-3.page').then( m => m.Esqueci3Page)
  },


  // Pagina do Projeto
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./mainPart/feed/feed.page').then( m => m.FeedPage)
      },
      {
        path: 'alarms',
        loadComponent: () => import('./mainPart/alarms/alarms.page').then( m => m.AlarmsPage)
        // canActivate: [authGuard]
      },
      {
        path: 'quests',
        loadComponent: () => import('./mainPart/quests/quests.page').then( m => m.QuestsPage)
        // canActivate: [authGuard]
      },
      {
        path: 'user',
        loadComponent: () => import('./mainPart/user/user.page').then( m => m.UserPage)
        // canActivate: [authGuard]
      },
    ]
  },
];