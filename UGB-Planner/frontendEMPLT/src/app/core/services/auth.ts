import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private urlApi = environment.apiUrl;
  private utilisateurConnecte = new BehaviorSubject<any>(null);

  utilisateur$ = this.utilisateurConnecte.asObservable();

  constructor(private http: HttpClient) {
    const utilisateurSauvegarde = localStorage.getItem('utilisateur');
    if (utilisateurSauvegarde) {
      this.utilisateurConnecte.next(JSON.parse(utilisateurSauvegarde));
    }
  }

  connexion(email: string, motDePasse: string): Observable<any> {
    return this.http.post(`${this.urlApi}/connexion`, {
      email: email,
      mot_de_passe: motDePasse
    }).pipe(
      tap((reponse: any) => {
        localStorage.setItem('jeton', reponse.jeton_acces);
        localStorage.setItem('utilisateur', JSON.stringify(reponse.utilisateur));
        this.utilisateurConnecte.next(reponse.utilisateur);
      })
    );
  }

  deconnexion(): Observable<any> {
    return this.http.post(`${this.urlApi}/deconnexion`, {}).pipe(
      tap(() => {
        localStorage.removeItem('jeton');
        localStorage.removeItem('utilisateur');
        this.utilisateurConnecte.next(null);
      })
    );
  }

  getJeton(): string | null {
    return localStorage.getItem('jeton');
  }

  estConnecte(): boolean {
    return !!this.getJeton();
  }

  estAdmin(): boolean {
    const utilisateur = this.utilisateurConnecte.value;
    return utilisateur && utilisateur.role === 'admin';
  }
}