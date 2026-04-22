import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Seance {

  private urlApi = `${environment.apiUrl}/seances`;

  constructor(private http: HttpClient) {}

  obtenirTous(filtres?: any): Observable<any> {
    let parametres = new HttpParams();
    if (filtres) {
      Object.keys(filtres).forEach(cle => {
        if (filtres[cle]) parametres = parametres.set(cle, filtres[cle]);
      });
    }
    return this.http.get(this.urlApi, { params: parametres });
  }

  obtenirParId(id: number): Observable<any> {
    return this.http.get(`${this.urlApi}/${id}`);
  }

  creer(donnees: any): Observable<any> {
    return this.http.post(this.urlApi, donnees);
  }

  modifier(id: number, donnees: any): Observable<any> {
    return this.http.put(`${this.urlApi}/${id}`, donnees);
  }

  supprimer(id: number): Observable<any> {
    return this.http.delete(`${this.urlApi}/${id}`);
  }
}