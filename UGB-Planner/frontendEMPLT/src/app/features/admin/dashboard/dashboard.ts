// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dashboard',
//   imports: [],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.css',
// })
// export class Dashboard {

// }
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Seance } from '../../../core/services/seance';
import { Enseignant } from '../../../core/services/enseignant';
import { Cours } from '../../../core/services/cours';
import { Salle } from '../../../core/services/salle';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  nombreSeances = 0;
  nombreEnseignants = 0;
  nombreCours = 0;
  nombreSalles = 0;
  dernieresSeances: any[] = [];
  chargement = true;

  constructor(
    private serviceSeance: Seance,
    private serviceEnseignant: Enseignant,
    private serviceCours: Cours,
    private serviceSalle: Salle
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    const maintenant = new Date();
    const semaine = this.obtenirNumeroSemaine(maintenant);
    const annee = maintenant.getFullYear();

    this.serviceEnseignant.obtenirTous().subscribe({
      next: (rep: any) => this.nombreEnseignants = rep.donnees.length
    });

    this.serviceCours.obtenirTous().subscribe({
      next: (rep: any) => this.nombreCours = rep.donnees.length
    });

    this.serviceSalle.obtenirTous().subscribe({
      next: (rep: any) => this.nombreSalles = rep.donnees.length
    });

    this.serviceSeance.obtenirTous({ semaine, annee }).subscribe({
      next: (rep: any) => {
        this.nombreSeances = rep.donnees.length;
        this.dernieresSeances = rep.donnees.slice(0, 5);
        this.chargement = false;
      }
    });
  }

  obtenirNumeroSemaine(date: Date): number {
    const debut = new Date(date.getFullYear(), 0, 1);
    const jours = Math.floor((date.getTime() - debut.getTime()) / 86400000);
    return Math.ceil((jours + debut.getDay() + 1) / 7);
  }
}