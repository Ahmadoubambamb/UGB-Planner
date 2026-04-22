import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Cours } from '../../../../core/services/cours';

@Component({
  selector: 'app-liste-cours',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-cours.html'
})
export class ListeCours implements OnInit {

  listeCours: any[] = [];
  chargement = true;
  messageSucces = '';
  messageErreur = '';
  afficherFormulaire = false;
  modeModification = false;
  idEnCours: number | null = null;

  formCours = {
    intitule: '',
    description: '',
    volume_horaire: 0
  };

  constructor(private serviceCours: Cours) {}

  ngOnInit(): void {
    this.chargerCours();
  }

  chargerCours(): void {
    this.chargement = true;
    this.serviceCours.obtenirTous().subscribe({
      next: (rep: any) => {
        this.listeCours = rep.donnees;
        this.chargement = false;
      },
      error: () => {
        this.messageErreur = 'Erreur lors du chargement.';
        this.chargement = false;
      }
    });
  }

  ouvrirFormulaire(cours?: any): void {
    this.afficherFormulaire = true;
    this.messageErreur = '';
    if (cours) {
      this.modeModification = true;
      this.idEnCours = cours.id;
      this.formCours = {
        intitule: cours.intitule,
        description: cours.description || '',
        volume_horaire: cours.volume_horaire || 0
      };
    } else {
      this.modeModification = false;
      this.idEnCours = null;
      this.formCours = { intitule: '', description: '', volume_horaire: 0 };
    }
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.messageErreur = '';
  }

  enregistrer(): void {
    this.messageErreur = '';
    if (!this.formCours.intitule) {
      this.messageErreur = 'L\'intitulé du cours est obligatoire.';
      return;
    }

    if (this.modeModification && this.idEnCours) {
      this.serviceCours.modifier(this.idEnCours, this.formCours).subscribe({
        next: () => {
          this.messageSucces = 'Cours modifié avec succès.';
          this.fermerFormulaire();
          this.chargerCours();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de la modification.';
        }
      });
    } else {
      this.serviceCours.creer(this.formCours).subscribe({
        next: () => {
          this.messageSucces = 'Cours ajouté avec succès.';
          this.fermerFormulaire();
          this.chargerCours();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de l\'ajout.';
        }
      });
    }
  }

  supprimer(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce cours ?')) return;
    this.serviceCours.supprimer(id).subscribe({
      next: () => {
        this.messageSucces = 'Cours supprimé avec succès.';
        this.chargerCours();
        setTimeout(() => this.messageSucces = '', 3000);
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression.';
        setTimeout(() => this.messageErreur = '', 3000);
      }
    });
  }
}
