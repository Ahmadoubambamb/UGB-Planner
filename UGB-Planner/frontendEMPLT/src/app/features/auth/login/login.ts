import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email = '';
  motDePasse = '';
  erreur = '';
  chargement = false;

  constructor(
    private serviceAuth: Auth,
    private routeur: Router
  ) {}

  seConnecter(): void {
    this.erreur = '';

    if (!this.email || !this.motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    this.chargement = true;

    this.serviceAuth.connexion(this.email, this.motDePasse).subscribe({
      next: () => {
        this.chargement = false;
        this.routeur.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.chargement = false;
        if (err.status === 422) {
          this.erreur = 'Email ou mot de passe incorrect.';
        } else {
          this.erreur = 'Une erreur est survenue. Réessayez.';
        }
      }
    });
  }
}
