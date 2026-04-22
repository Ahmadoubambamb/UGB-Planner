import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Enseignant } from '../../../../core/services/enseignant';

@Component({
  selector: 'app-liste-enseignants',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './liste-enseignants.html'
})
export class ListeEnseignants implements OnInit {

  listeEnseignants: any[] = [];
  chargement = true;
  messageSucces = '';
  messageErreur = '';

  // Formulaire ajout/modification
  afficherFormulaire = false;
  modeModification = false;
  idEnCours: number | null = null;

  formEnseignant = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    specialite: ''
  };

  constructor(private serviceEnseignant: Enseignant) {}

  ngOnInit(): void {
    this.chargerEnseignants();
  }

  chargerEnseignants(): void {
    this.chargement = true;
    this.serviceEnseignant.obtenirTous().subscribe({
      next: (rep: any) => {
        this.listeEnseignants = rep.donnees;
        this.chargement = false;
      },
      error: () => {
        this.messageErreur = 'Erreur lors du chargement.';
        this.chargement = false;
      }
    });
  }

  ouvrirFormulaire(enseignant?: any): void {
    this.afficherFormulaire = true;
    this.messageErreur = '';
    if (enseignant) {
      this.modeModification = true;
      this.idEnCours = enseignant.id;
      this.formEnseignant = {
        nom: enseignant.nom,
        prenom: enseignant.prenom,
        email: enseignant.email,
        telephone: enseignant.telephone || '',
        specialite: enseignant.specialite || ''
      };
    } else {
      this.modeModification = false;
      this.idEnCours = null;
      this.formEnseignant = { nom: '', prenom: '', email: '', telephone: '', specialite: '' };
    }
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.messageErreur = '';
  }

  enregistrer(): void {
    this.messageErreur = '';

    if (!this.formEnseignant.nom || !this.formEnseignant.prenom || !this.formEnseignant.email) {
      this.messageErreur = 'Nom, prénom et email sont obligatoires.';
      return;
    }

    if (this.modeModification && this.idEnCours) {
      this.serviceEnseignant.modifier(this.idEnCours, this.formEnseignant).subscribe({
        next: () => {
          this.messageSucces = 'Enseignant modifié avec succès.';
          this.fermerFormulaire();
          this.chargerEnseignants();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de la modification.';
        }
      });
    } else {
      this.serviceEnseignant.creer(this.formEnseignant).subscribe({
        next: () => {
          this.messageSucces = 'Enseignant ajouté avec succès.';
          this.fermerFormulaire();
          this.chargerEnseignants();
          setTimeout(() => this.messageSucces = '', 3000);
        },
        error: (err) => {
          this.messageErreur = err.error?.message || 'Erreur lors de l\'ajout.';
        }
      });
    }
  }

  supprimer(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer cet enseignant ?')) return;

    this.serviceEnseignant.supprimer(id).subscribe({
      next: () => {
        this.messageSucces = 'Enseignant supprimé avec succès.';
        this.chargerEnseignants();
        setTimeout(() => this.messageSucces = '', 3000);
      },
      error: () => {
        this.messageErreur = 'Erreur lors de la suppression.';
        setTimeout(() => this.messageErreur = '', 3000);
      }
    });
  }
}
