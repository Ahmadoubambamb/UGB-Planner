import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Seance } from '../../../core/services/seance';
import { Enseignant } from '../../../core/services/enseignant';
import { Cours } from '../../../core/services/cours';
import { Salle } from '../../../core/services/salle';

@Component({
  selector: 'app-emploi-du-temps',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emploi-du-temps.html'
})
export class EmploiDuTemps implements OnInit {

  listeSeances: any[] = [];
  listeEnseignants: any[] = [];
  listeCours: any[] = [];
  listeSalles: any[] = [];
  chargement = true;

  // En-tête document
  infoClasse = '';
  anneeAcademique = '';

  // Filtres
  filtreEnseignant = '';
  filtreCours = '';
  filtreSalle = '';
  filtreClasse = '';
  filtreSemaine: number;
  filtreAnnee: number;

  jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

  // Plages horaires de base (2h chacune)
  // heures = ['08','09','10','11','12','13','14','15','16','17','18','19','20'];
  plagesHoraires = [
    { debut: '08:00', fin: '10:00' },
    { debut: '10:00', fin: '12:00' },
    { debut: '12:00', fin: '14:00' },
    { debut: '14:00', fin: '16:00' },
    { debut: '16:00', fin: '18:00' },
    { debut: '18:00', fin: '20:00' },
  ];

  couleurs = [
    'border-primary bg-primary bg-opacity-10 text-primary',
    'border-success bg-success bg-opacity-10 text-success',
    'border-warning bg-warning bg-opacity-10 text-warning',
    'border-danger bg-danger bg-opacity-10 text-danger',
    'border-info bg-info bg-opacity-10 text-info',
  ];

  mapCouleursCours: { [key: number]: string } = {};

  constructor(
    private serviceSeance: Seance,
    private serviceEnseignant: Enseignant,
    private serviceCours: Cours,
    private serviceSalle: Salle
  ) {
    const maintenant = new Date();
    this.filtreSemaine = this.obtenirNumeroSemaine(maintenant);
    this.filtreAnnee = maintenant.getFullYear();
    this.anneeAcademique = `${maintenant.getFullYear() - 1}-${maintenant.getFullYear()}`;
  }

  ngOnInit(): void {
    this.chargerOptions();
    this.chargerSeances();
  }

  chargerOptions(): void {
    this.serviceEnseignant.obtenirTous().subscribe({
      next: (rep: any) => this.listeEnseignants = rep.donnees
    });
    this.serviceCours.obtenirTous().subscribe({
      next: (rep: any) => {
        this.listeCours = rep.donnees;
        rep.donnees.forEach((cours: any, index: number) => {
          this.mapCouleursCours[cours.id] = this.couleurs[index % this.couleurs.length];
        });
      }
    });
    this.serviceSalle.obtenirTous().subscribe({
      next: (rep: any) => this.listeSalles = rep.donnees
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
    if (this.filtreSalle) filtres['salle_id'] = this.filtreSalle;
    if (this.filtreClasse) filtres['classe'] = this.filtreClasse;

    this.serviceSeance.obtenirTous(filtres).subscribe({
      next: (rep: any) => {
        this.listeSeances = rep.donnees;
        this.chargement = false;
      },
      error: () => this.chargement = false
    });
  }

  // Convertit "10:00" en minutes depuis minuit
  enMinutes(heure: string): number {
    const [h, m] = heure.substring(0, 5).split(':').map(Number);
    return h * 60 + m;
  }

  // Calcule le colspan d'une séance selon les plages
//  obtenirDuree(seance: any): number {
//      return this.enHeure(seance.heure_fin) - this.enHeure(seance.heure_debut);
//   }
//   enHeure(heureStr: string): number {
//     return parseInt(heureStr.substring(0, 2), 10);
//   }
  obtenirColspan(seance: any): number {
    const debut = this.enMinutes(seance.heure_debut);
    const fin = this.enMinutes(seance.heure_fin);
    let colspan = 0;

    this.plagesHoraires.forEach(plage => {
      const plageDebut = this.enMinutes(plage.debut);
      const plageFin = this.enMinutes(plage.fin);
      // La plage est couverte par la séance si elle est dans l'intervalle
      if (plageDebut >= debut && plageFin <= fin) {
        colspan++;
      }
    });

    return colspan || 1;
  }

  // Retourne la séance qui commence exactement à cette plage
 // Retourne la séance qui commence dans cette plage
//   obtenirSeanceParHeure(jour: string, heure: string): any {
//   return this.listeSeances.find(s =>
//     s.jour === jour &&
//     this.enHeure(s.heure_debut) === parseInt(heure, 10)
//   );
// }
  obtenirSeanceDebutant(jour: string, plageDebut: string): any {
    const plageDebutMin = this.enMinutes(plageDebut);
    const plageFin = this.plagesHoraires.find(p => p.debut === plageDebut);
    const plageFinMin = plageFin ? this.enMinutes(plageFin.fin) : plageDebutMin + 120;

    return this.listeSeances.find(s => {
      if (s.jour !== jour) return false;
      const seanceDebut = this.enMinutes(s.heure_debut);
      // La séance commence dans cette plage
      return seanceDebut >= plageDebutMin && seanceDebut < plageFinMin;
    });
  }

    // Vérifie si cette plage est couverte par une séance précédente
  // heureOccupee(jour: string, heure: string): boolean {
  //     const heureInt = parseInt(heure, 10);
  //     return this.listeSeances.some(s => {
  //       if (s.jour !== jour) return false;
  //       const debut = this.enHeure(s.heure_debut);
  //       const fin = this.enHeure(s.heure_fin);
  //       return debut < heureInt && heureInt < fin;
  //     });
  //   }
  estCouverte(jour: string, plageDebut: string): boolean {
    const plageDebutMin = this.enMinutes(plageDebut);
    return this.listeSeances.some(s => {
      if (s.jour !== jour) return false;
      const seanceDebut = this.enMinutes(s.heure_debut);
      const seanceFin = this.enMinutes(s.heure_fin);
      return seanceDebut < plageDebutMin && seanceFin > plageDebutMin;
    });
  }

  // Construit la grille pour un jour donné
  obtenirCellulesJour(jour: string): any[] {
    const cellules: any[] = [];

    this.plagesHoraires.forEach(plage => {
      // Si cette plage est couverte par une séance précédente → skip
      if (this.estCouverte(jour, plage.debut)) {
        return;
      }

      const seance = this.obtenirSeanceDebutant(jour, plage.debut);
      if (seance) {
        // Séance trouvée → calculer le colspan
        cellules.push({
          type: 'seance',
          seance: seance,
          colspan: this.obtenirColspan(seance)
        });
      } else {
        // Cellule vide
        cellules.push({
          type: 'vide',
          colspan: 1
        });
      }
    });

    return cellules;
  }
  // obtenirCellulesJour(jour: string): any[] {
  //   const cellules: any[] = [];

  //   this.heures.forEach(heure => {
  //     if (this.heureOccupee(jour, heure)) return;

  //     const seance = this.obtenirSeanceParHeure(jour, heure);
  //     if (seance) {
  //       cellules.push({
  //         type: 'seance',
  //         seance: seance,
  //         colspan: this.obtenirDuree(seance)
  //       });
  //     } else {
  //       cellules.push({ type: 'vide', colspan: 1 });
  //     }
  //   });

  //   return cellules;
  // }
  // ---------------
  obtenirCouleur(coursId: number): string {
    return this.mapCouleursCours[coursId] || this.couleurs[0];
  }

  obtenirLundiSemaine(): Date {
    const janv = new Date(this.filtreAnnee, 0, 1);
    const joursDepuisJanv = (this.filtreSemaine - 1) * 7;
    const lundi = new Date(janv.getTime() + joursDepuisJanv * 86400000);
    const jourSemaine = lundi.getDay();
    const diff = jourSemaine === 0 ? -6 : 1 - jourSemaine;
    lundi.setDate(lundi.getDate() + diff);
    return lundi;
  }

  obtenirDateJour(indexJour: number): string {
    const lundi = this.obtenirLundiSemaine();
    const date = new Date(lundi.getTime() + indexJour * 86400000);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
  }

  obtenirDateDebutSemaine(): string {
    const lundi = this.obtenirLundiSemaine();
    return lundi.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  obtenirDateFinSemaine(): string {
    const lundi = this.obtenirLundiSemaine();
    const samedi = new Date(lundi.getTime() + 5 * 86400000);
    return samedi.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  reinitialiserFiltres(): void {
    this.filtreEnseignant = '';
    this.filtreCours = '';
    this.filtreSalle = '';
    this.filtreClasse = '';
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

    // Récupère la classe depuis les séances chargées
  obtenirClasseAffichee(): string {
      if (this.listeSeances.length > 0 && this.listeSeances[0].classe) {
        return this.listeSeances[0].classe;
      }
      return '';
  }
  // Récupère toutes les classes distinctes depuis les séances
  obtenirClassesDisponibles(): string[] {
      const toutesSeances$ = this.serviceSeance.obtenirTous({
        semaine: this.filtreSemaine,
        annee: this.filtreAnnee
      });
      // On utilise la liste déjà chargée
      const classes = this.listeSeances
        .map(s => s.classe)
        .filter(c => c && c.trim() !== '');
      return [...new Set(classes)];
  }
  exporterPDF(): void {
    const titre = document.title;
    document.title = `EDT_${this.infoClasse || 'Semaine'}_${this.filtreSemaine}_${this.filtreAnnee}`;
    window.print();
    document.title = titre;
  }
}