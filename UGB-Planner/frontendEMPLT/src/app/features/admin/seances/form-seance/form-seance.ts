import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Seance } from '../../../../core/services/seance';
import { Enseignant } from '../../../../core/services/enseignant';
import { Cours } from '../../../../core/services/cours';
import { Salle } from '../../../../core/services/salle';

@Component({
  selector: 'app-form-seance',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './form-seance.html',
  styleUrl: './form-seance.css'
})
export class FormSeance implements OnInit {

  modeModification = false;
  idSeance: number | null = null;
  chargement = false;
  messageErreur = '';

  listeEnseignants: any[] = [];
  listeCours: any[] = [];
  listeSalles: any[] = [];

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  horaires = ['08:00', '09:00', '10:00', '11:00', '12:00',
              '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  formSeance = {
    cours_id: '',
    enseignant_id: '',
    salle_id: '',
    jour: '',
    heure_debut: '',
    heure_fin: '',
    semaine: this.obtenirNumeroSemaine(new Date()),
    annee: new Date().getFullYear(),
    classe: ''  
  };

  constructor(
    private serviceSeance: Seance,
    private serviceEnseignant: Enseignant,
    private serviceCours: Cours,
    private serviceSalle: Salle,
    private routeur: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.chargerOptions();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modeModification = true;
      this.idSeance = +id;
      this.chargerSeance(this.idSeance);
    }
  }

  chargerOptions(): void {
    this.serviceEnseignant.obtenirTous().subscribe({
      next: (rep: any) => this.listeEnseignants = rep.donnees
    });
    this.serviceCours.obtenirTous().subscribe({
      next: (rep: any) => this.listeCours = rep.donnees
    });
    this.serviceSalle.obtenirTous().subscribe({
      next: (rep: any) => this.listeSalles = rep.donnees
    });
  }

  chargerSeance(id: number): void {
    this.serviceSeance.obtenirParId(id).subscribe({
      next: (rep: any) => {
        const seance = rep.donnees;
        this.formSeance = {
          cours_id: seance.cours_id,
          enseignant_id: seance.enseignant_id,
          salle_id: seance.salle_id,
          jour: seance.jour,
          heure_debut: seance.heure_debut,
          heure_fin: seance.heure_fin,
          semaine: seance.semaine,
          annee: seance.annee,
          classe: seance.classe
        };
      }
    });
  }

  enregistrer(): void {
    this.messageErreur = '';

    if (!this.formSeance.cours_id || !this.formSeance.enseignant_id ||
        !this.formSeance.salle_id || !this.formSeance.jour ||
        !this.formSeance.heure_debut || !this.formSeance.heure_fin) {
      this.messageErreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    this.chargement = true;

    if (this.modeModification && this.idSeance) {
      this.serviceSeance.modifier(this.idSeance, this.formSeance).subscribe({
        next: () => {
          this.chargement = false;
          this.routeur.navigate(['/admin/seances']);
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = err.error?.message || 'Erreur lors de la modification.';
        }
      });
    } else {
      this.serviceSeance.creer(this.formSeance).subscribe({
        next: () => {
          this.chargement = false;
          this.routeur.navigate(['/admin/seances']);
        },
        error: (err) => {
          this.chargement = false;
          this.messageErreur = err.error?.message || 'Erreur lors de la création.';
        }
      });
    }
  }

  obtenirNumeroSemaine(date: Date): number {
    const debut = new Date(date.getFullYear(), 0, 1);
    const jours = Math.floor((date.getTime() - debut.getTime()) / 86400000);
    return Math.ceil((jours + debut.getDay() + 1) / 7);
  }
}