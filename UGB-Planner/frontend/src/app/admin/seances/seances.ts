import { Component, inject, OnInit, signal } from '@angular/core';
import { SeanceService } from '../../core/services/seance-service';
import { CoursService } from '../../core/services/cours-service';
import { EnseignantService } from '../../core/services/enseignant-service';
import { SalleService } from '../../core/services/salle-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-seances',
  imports: [CommonModule , FormsModule],
  templateUrl: './seances.html',
  styleUrl: './seances.css',
})
export class Seances implements OnInit {
private svc = inject(SeanceService)
private cSvc = inject(CoursService);
private eSvc = inject(EnseignantService);
private rSvc = inject(SalleService);

seances = signal<any[]>([]);
cours = signal<any[]>([]);
enseignants = signal<any[]>([]);
salles = signal<any[]>([]);
showModal = signal(false);
editMode = signal(false);
erreur = signal('');
jours = ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'];
heures = ['08:00','09:00','10:00','11:00','12:00',
'13:00','14:00','15:00','16:00','17:00','18:00'];
form = signal({
  id: 0, jour_nom: 'Lundi', heure_debut: '08:00', heure_fin: '10:00',
cours_id: 0, enseignant_id: 0, salle_id: 0,
semaine: 1, annee: new Date().getFullYear()
});

ngOnInit(): void {
  this.svc.getAll().subscribe((d: any) => this.seances.set(d));
  this.cSvc.getAll().subscribe((d: any) => this.cours.set(d));
this.eSvc.getAll().subscribe((d: any) => this.enseignants.set(d));
this.rSvc.getAll().subscribe((d: any) => this.salles.set(d));

}

openCreate(){
 this.form.set({ id:0, jour_nom:'Lundi', heure_debut:'08:00', heure_fin:'10:00',
cours_id:0, enseignant_id:0, salle_id:0,
semaine:1, annee:new Date().getFullYear() });
this.editMode.set(false); this.erreur.set(''); this.showModal.set(true);

}

openEdit(s: any){
this.form.set({ id:s.id, jour_nom:s.jour_nom, heure_debut:s.heure_debut,
heure_fin:s.heure_fin, cours_id:s.cours_id, enseignant_id:s.enseignant_id,
salle_id:s.salle_id, semaine:s.semaine, annee:s.annee });
this.editMode.set(true); this.erreur.set(''); this.showModal.set(true);
}

save(){
  const obs = this.editMode() ? this.svc.update(this.form().id, this.form())
: this.svc.create(this.form());
obs.subscribe({
next: () => { this.reload(); this.showModal.set(false); },
error: (e: any) => this.erreur.set(e.error?.message || 'Conflit de creneau'),
});
}

supprimer(){
  if (confirm('Supprimer cette seance ?'))
this.svc.delete(this.form().id).subscribe(() => {
this.reload(); this.showModal.set(false);
});
}

reload() { this.svc.getAll().subscribe((d: any) => this.seances.set(d)); }
set(k: string, v: any) { this.form.update(f => ({...f, [k]: v})); }

}
