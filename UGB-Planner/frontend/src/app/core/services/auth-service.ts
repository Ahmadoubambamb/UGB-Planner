import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private api = 'http://localhost:8080/api';
  isLoggedIn = signal(!!localStorage.getItem('token'));
  currentUser = signal<any>(JSON.parse(localStorage.getItem('user') || 'null'));

login(email: string, password: string){
  return this.http.post(`${this.api}/login`, { email, password });
}

saveSession(token: string, user: any) {
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(user));
this.isLoggedIn.set(true); this.currentUser.set(user);
}
logout() {
  localStorage.clear();
  this.isLoggedIn.set(false); this.currentUser.set(null);
  this.router.navigate(['/login']);
}

}
