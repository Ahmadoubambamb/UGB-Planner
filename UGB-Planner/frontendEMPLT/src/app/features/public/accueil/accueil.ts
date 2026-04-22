import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Seance } from '../../../core/services/seance';
import { Enseignant } from '../../../core/services/enseignant';
import { Cours } from '../../../core/services/cours';
import { Salle } from '../../../core/services/salle';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {

  nombreEnseignants = 0;
  nombreCours = 0;
  nombreSeances = 0;
  nombreSalles = 0;

  constructor(
    private serviceSeance: Seance,
    private serviceEnseignant: Enseignant,
    private serviceCours: Cours,
    private serviceSalle: Salle
  ) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.serviceEnseignant.obtenirTous().subscribe({
      next: (reponse: any) => this.nombreEnseignants = reponse.donnees.length
    });

    this.serviceCours.obtenirTous().subscribe({
      next: (reponse: any) => this.nombreCours = reponse.donnees.length
    });

    this.serviceSalle.obtenirTous().subscribe({
      next: (reponse: any) => this.nombreSalles = reponse.donnees.length
    });

    const maintenant = new Date();
    const numeroSemaine = this.obtenirNumeroSemaine(maintenant);
    const annee = maintenant.getFullYear();

    this.serviceSeance.obtenirTous({ semaine: numeroSemaine, annee }).subscribe({
      next: (reponse: any) => this.nombreSeances = reponse.donnees.length
    });
  }

  obtenirNumeroSemaine(date: Date): number {
    const debut = new Date(date.getFullYear(), 0, 1);
    const jours = Math.floor((date.getTime() - debut.getTime()) / 86400000);
    return Math.ceil((jours + debut.getDay() + 1) / 7);
  }
}