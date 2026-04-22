import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { adminGuard } from './core/guards/admin-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },

  // Pages publiques
  {
    path: 'accueil',
    loadComponent: () =>
      import('./features/public/accueil/accueil')
        .then(m => m.Accueil)
  },
  {
    path: 'emploi-du-temps',
    loadComponent: () =>
      import('./features/public/emploi-du-temps/emploi-du-temps')
        .then(m => m.EmploiDuTemps)
  },

  // Page connexion
  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },

  // Espace admin protégé
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'seances',
        loadComponent: () =>
          import('./features/admin/seances/liste-seances/liste-seances')
            .then(m => m.ListeSeances)
      },
      {
        path: 'seances/nouvelle',
        loadComponent: () =>
          import('./features/admin/seances/form-seance/form-seance')
            .then(m => m.FormSeance)
      },
      {
        path: 'seances/modifier/:id',
        loadComponent: () =>
          import('./features/admin/seances/form-seance/form-seance')
            .then(m => m.FormSeance)
      },
      {
        path: 'enseignants',
        loadComponent: () =>
          import('./features/admin/enseignants/liste-enseignants/liste-enseignants')
            .then(m => m.ListeEnseignants)
      },
      {
        path: 'cours',
        loadComponent: () =>
          import('./features/admin/cours/liste-cours/liste-cours')
            .then(m => m.ListeCours)
      },
      {
        path: 'salles',
        loadComponent: () =>
          import('./features/admin/salles/liste-salles/liste-salles')
            .then(m => m.ListeSalles)
      }
    ]
  },

  { path: '**', redirectTo: 'accueil' }
];