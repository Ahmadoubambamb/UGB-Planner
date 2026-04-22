import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SalleService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/salles';
  getAll() { return this.http.get(this.url); }
  getById(id: number){
    return this.http.get(`${this.url}/${id}`);
  }

  create(data: { nom: string; batiment: string; capacite: number }) {
return this.http.post(this.url, data);
}
/** Modifier une salle (PUT /api/salles/:id) */
update(id: number, data: { nom: string; batiment: string; capacite: number }) {
return this.http.put(`${this.url}/${id}`, data);
}
/** Supprimer une salle (DELETE /api/salles/:id) */
delete(id: number) {
return this.http.delete(`${this.url}/${id}`);
}

}
