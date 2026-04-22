import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class Enseignant {

  private urlApi = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) {}

  obtenirTous(): Observable<any> {
    return this.http.get(this.urlApi);
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
