import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CoursService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/cours';
  getAll(){
    return this.http.get(this.url);
  }

  getById(id: number){
    return this.http.get(`${this.url}/${id}`);
  }

  create(data: { intitule: string; code: string; credits: number }) {
return this.http.post(this.url, data);
}

update(id: number, data: { intitule: string; code: string; credits: number }) {
return this.http.put(`${this.url}/${id}`, data);
}
/** Supprimer un cours (DELETE /api/cours/:id) */
delete(id: number) {
return this.http.delete(`${this.url}/${id}`);
}

}
