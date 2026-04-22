import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const serviceAuth = inject(Auth);
  const routeur = inject(Router);

  if (serviceAuth.estConnecte() && serviceAuth.estAdmin()) {
    return true;
  }

  routeur.navigate(['/accueil']);
  return false;
};