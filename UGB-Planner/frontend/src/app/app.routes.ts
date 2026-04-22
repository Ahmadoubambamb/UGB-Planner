import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
   {path: '' ,
    loadComponent: ()=> import('./visitor/emploi-du-temps/emploi-du-temps').then(m =>m.EmploiDuTemps)
   },
   { path: 'login',
    loadComponent: ()=> import('./admin/login/login').then(m =>m.Login)
   },
   {
    path: 'admin' , canActivate:[authGuard] ,
    loadComponent: ()=> import('./admin/layout/layout').then(m =>m.Layout),
    children: [
       { path: '', redirectTo:'dashboard', pathMatch:'full'},
       {path: 'dashboard', loadComponent: ()=> import('./admin/dashboard/dashboard').then(m =>m.Dashboard)},
       {path: 'seances', loadComponent: ()=> import('./admin/seances/seances').then(m =>m.Seances)},
       {path: 'cours' , loadComponent: ()=>import('./admin/cours/cours').then(m =>m.Cours)},
       {path: 'enseignants' , loadComponent: ()=>import('./admin/enseignants/enseignants').then(m =>m.Enseignants)},
       {path: 'salles' , loadComponent: ()=>import('./admin/salles/salles').then(m =>m.Salles)},
   
    ]  
},

];
