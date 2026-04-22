import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Salle } from '../../../../core/services/salle';

@Component({
  selector: 'app-liste-salles',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-salles.html'
})
export class ListeSalles implements OnInit {

  listeSalles: any[] = [];
  chargement = true;
  messageSucces = '';
  messageErreur = '';
  afficherFormulaire = false;
  modeModification = false;
  idEnCours: number | null = null;

  typesSalle = ['cours', 'labo', 'amphi'];

  formSalle = {
    numero: '',
    capacite: 30,
    type: 'cours'
  };

  constructor(private serviceSalle: Salle) {}

  ngOnInit(): void {
    this.chargerSalles();
  }

  chargerSalles(): void {
    this.chargement = true;
    this.serviceSalle.obtenirTous().subscribe({
      next: (rep: any) => {
        this.listeSalles = rep.donnees;
        this.chargement = false;
      },
      error: () => {
        this.messageErreur = 'Erreur lors du chargement.';
        this.chargement = false;
      }
    });
  }

  ouvrirFormulaire(salle?: any): void {
    this.afficherFormulaire = true;
    this.messageErreur = '';
    if (salle) {
      this.modeModification = true;
      this.idEnCours = salle.id;
      this.formSalle = {
        numero: salle.numero,
        capacite: salle.capacite,
        type: salle.type
      };
    } else {
      this.modeModification = false;
      this.idEnCours = null;
      this.formSalle = { numero: '', capacite: 30, type: 'cours' };
    }
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.messageErreur = '';
  }

  enregistrer(): void {
    this.messageErreur = '';
    if (!this.formSalle.numero) {
      this.messageErreur = 'Le numéro de salle est obligatoire.';
      return;
    }

    if (this.modeModification && this.idEnCours) {
      this.serviceSalle.modifier(this.idEnCours, this.formSalle).subscribe({
        next: () => {
          this.messageSucces = 'Salle modifiée avec succès.';
          this.fermerFormulaire();
          this.chargerSalles();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de la modification.';
        }
      });
    } else {
      this.serviceSalle.creer(this.formSalle).subscribe({
        next: () => {
          this.messageSucces = 'Salle ajoutée avec succès.';
          this.fermerFormulaire();
          this.chargerSalles();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de l\'ajout.';
        }
      });
    }
  }

  supprimer(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cette salle ?')) return;
    this.serviceSalle.supprimer(id).subscribe({
      next: () => {
        this.messageSucces = 'Salle supprimée avec succès.';
        this.chargerSalles();
        setTimeout(() => this.messageSucces = '', 3000);
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression.';
        setTimeout(() => this.messageErreur = '', 3000);
      }
    });
  }
}