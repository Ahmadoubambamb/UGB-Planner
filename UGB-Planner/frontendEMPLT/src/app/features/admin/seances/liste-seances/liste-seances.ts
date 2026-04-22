import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Seance } from '../../../../core/services/seance';
import { Enseignant } from '../../../../core/services/enseignant';
import { Cours } from '../../../../core/services/cours';

@Component({
  selector: 'app-liste-seances',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-seances.html',
  styleUrl: './liste-seances.css'
})
export class ListeSeances implements OnInit {

  listeSeances: any[] = [];
  listeEnseignants: any[] = [];
  listeCours: any[] = [];
  chargement = true;
  messageSucces = '';
  messageErreur = '';

  // Filtres
  filtreEnseignant = '';
  filtreCours = '';
  filtreSemaine: number;
  filtreAnnee: number;
  filtreJour = '';

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  constructor(
    private serviceSeance: Seance,
    private serviceEnseignant: Enseignant,
    private serviceCours: Cours
  ) {
    const maintenant = new Date();
    this.filtreSemaine = this.obtenirNumeroSemaine(maintenant);
    this.filtreAnnee = maintenant.getFullYear();
  }

  ngOnInit(): void {
    this.chargerFiltres();
    this.chargerSeances();
  }

  chargerFiltres(): void {
    this.serviceEnseignant.obtenirTous().subscribe({
      next: (rep: any) => this.listeEnseignants = rep.donnees
    });
    this.serviceCours.obtenirTous().subscribe({
      next: (rep: any) => this.listeCours = rep.donnees
    });
  }

  chargerSeances(): void {
    this.chargement = true;
    const filtres: any = {
      semaine: this.filtreSemaine,
      annee: this.filtreAnnee
    };
    if (this.filtreEnseignant) filtres['enseignant_id'] = this.filtreEnseignant;
    if (this.filtreCours) filtres['cours_id'] = this.filtreCours;
    if (this.filtreJour) filtres['jour'] = this.filtreJour;

    this.serviceSeance.obtenirTous(filtres).subscribe({
      next: (rep: any) => {
        this.listeSeances = rep.donnees;
        this.chargement = false;
      },
      error: () => {
        this.messageErreur = 'Erreur lors du chargement des séances.';
        this.chargement = false;
      }
    });
  }

  supprimerSeance(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette séance ?')) return;

    this.serviceSeance.supprimer(id).subscribe({
      next: () => {
        this.messageSucces = 'Séance supprimée avec succès.';
        this.chargerSeances();
        setTimeout(() => this.messageSucces = '', 3000);
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression.';
        setTimeout(() => this.messageErreur = '', 3000);
      }
    });
  }

  reinitialiserFiltres(): void {
    this.filtreEnseignant = '';
    this.filtreCours = '';
    this.filtreJour = '';
    const maintenant = new Date();
    this.filtreSemaine = this.obtenirNumeroSemaine(maintenant);
    this.filtreAnnee = maintenant.getFullYear();
    this.chargerSeances();
  }

  obtenirNumeroSemaine(date: Date): number {
    const debut = new Date(date.getFullYear(), 0, 1);
    const jours = Math.floor((date.getTime() - debut.getTime()) / 86400000);
    return Math.ceil((jours + debut.getDay() + 1) / 7);
  }

  semainePrecedente(): void {
    if (this.filtreSemaine > 1) {
      this.filtreSemaine--;
    } else {
      this.filtreSemaine = 52;
      this.filtreAnnee--;
    }
    this.chargerSeances();
  }

  semaineSuivante(): void {
    if (this.filtreSemaine < 52) {
      this.filtreSemaine++;
    } else {
      this.filtreSemaine = 1;
      this.filtreAnnee++;
    }
    this.chargerSeances();
  }
}
