import { Component, inject, OnInit, signal } from '@angular/core';
import { SeanceService } from '../../core/services/seance-service';
import { Router } from '@angular/router';
import { CoursService } from '../../core/services/cours-service';
import { EnseignantService } from '../../core/services/enseignant-service';
import { SalleService } from '../../core/services/salle-service';
import { Seances } from '../seances/seances';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
 private seanceSvc = inject(SeanceService);
 private coursSvc = inject(CoursService);
 private enseignantSvc = inject(EnseignantService);
 private salleSvc = inject(SalleService);
 private router = inject(Router);

 stats = signal({seances: 0, cours: 0, enseignants: 0, salles: 0});
 seances = signal<any[]>([]);
 semaine = signal(this.semaineISO());

 jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
 horaires = ['08:00','09:00','10:00','11:00','12:00',
'13:00','14:00','15:00','16:00','17:00','18:00'];
couleurs = ['card-pink','card-teal','card-violet','card-cyan','card-purple'];
couleurMap = new Map<number,string>(); 
ngOnInit(): void{
this.seanceSvc.getAll().subscribe((d: any) => {
this.stats.update(s => ({...s, seances: d.length}));
this.seances.set(d);
d.forEach((s: any) => {
if (!this.couleurMap.has(s.cours_id))
this.couleurMap.set(s.cours_id,
this.couleurs[this.couleurMap.size % this.couleurs.length]);
});
});
this.coursSvc.getAll().subscribe((d: any) =>
this.stats.update(s => ({...s, cours: d.length})));
this.enseignantSvc.getAll().subscribe((d: any) =>
this.stats.update(s => ({...s, enseignants: d.length})));
this.salleSvc.getAll().subscribe((d: any) =>
this.stats.update(s => ({...s, salles: d.length})));

  }

  getSeance(j: string , h: string){
  return this.seances().find(s => s.jour_nom ===j && s.heure_debut === h);
  }

getCouleur(s: any) { return this.couleurMap.get(s.cours_id) || 'card-purple'; }
nouvelleSeance() { this.router.navigate(['/admin/seances']); }
semaineISO() {
const n=new Date(),s=new Date(n.getFullYear(),0,1);
return Math.ceil(((n.getTime()-s.getTime())/86400000+s.getDay()+1)/7);
}
}
