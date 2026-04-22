import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})

export class Navbar implements OnInit {

  estConnecte = false;
  estAdmin = false;
  nomUtilisateur = '';

  constructor(
    private serviceAuth: Auth,
    private routeur: Router
  ) {}

  ngOnInit(): void {
    this.serviceAuth.utilisateur$.subscribe(utilisateur => {
      this.estConnecte = !!utilisateur;
      this.estAdmin = utilisateur?.role === 'admin';
      this.nomUtilisateur = utilisateur?.name || '';
    });
  }

  deconnexion(): void {
    this.serviceAuth.deconnexion().subscribe({
      next: () => this.routeur.navigate(['/accueil']),
      error: () => {
        localStorage.clear();
        this.routeur.navigate(['/accueil']);
      }
    });
  }
}