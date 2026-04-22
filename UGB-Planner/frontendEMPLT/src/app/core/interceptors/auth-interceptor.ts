import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (requete, next) => {
  const jeton = localStorage.getItem('jeton');

  if (jeton) {
    const requeteAvecJeton = requete.clone({
      headers: requete.headers
        .set('Authorization', `Bearer ${jeton}`)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
    });
    return next(requeteAvecJeton);
  }

  const requeteAvecHeaders = requete.clone({
    headers: requete.headers
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
  });

  return next(requeteAvecHeaders);
};
