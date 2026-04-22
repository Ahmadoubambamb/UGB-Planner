import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EnseignantService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/enseignants';
  getAll() { return this.http.get(this.url); }

  getById(id: number){
    return this.http.get(`${this.url}/${id}`);
  }

  create(data: { nom: string; prenom: string; email: string; specialite: string }) {
return this.http.post(this.url, data);
}
/** Modifier un enseignant (PUT /api/enseignants/:id) */
update(id: number,
data: { nom: string; prenom: string; email: string; specialite: string }) {
return this.http.put(`${this.url}/${id}`, data);
}
/** Supprimer un enseignant (DELETE /api/enseignants/:id) */
delete(id: number) {
return this.http.delete(`${this.url}/${id}`);
}

}
