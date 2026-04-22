import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const serviceAuth = inject(Auth);
  const routeur = inject(Router);

  if (serviceAuth.estConnecte()) {
    return true;
  }

  routeur.navigate(['/connexion']);
  return false;
};
