import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
private auth = inject(AuthService);
private router = inject(Router);
email = signal('');
password = signal('');
loading = signal(false);
erreur = signal('');

login(){
  this.loading.set(true);
  this.erreur.set('');
  this.auth.login(this.email() , this.password()).subscribe({
    next: (res: any) =>{
      this.auth.saveSession(res.token , res.user);
      this.router.navigate(['/admin/dashboard']);
    },
    error: () =>{
      this.erreur.set('Email ou mot de passe incorrects');
      this.loading.set(false);
    }
  })

}


}
