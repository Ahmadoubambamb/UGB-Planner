import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeanceService {
  private http = inject(HttpClient);
  private url = 'http://localhost:8080/api/seances';
  getAll() { return this.http.get(this.url); }
  getBySemaine(sem: number , annee: number) { 
    return this.http.get(`${this.url}?semaine=${sem}&annee=${annee}`);
   }
   getById(id: number){
    return this.http.get(`${this.url}/${id}`);
   }
    create(data: any){  
    return this.http.post(this.url, data);
   }
    update(id: number, d: any){
    return this.http.put(`${this.url}/${id}`, d);
    }
    delete(id: number){
    return this.http.delete(`${this.url}/${id}`);
    }
}


