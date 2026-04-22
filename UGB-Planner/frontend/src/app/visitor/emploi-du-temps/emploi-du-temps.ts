import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SeanceService } from '../../core/services/seance-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-emploi-du-temps',
  imports: [CommonModule , FormsModule],
  templateUrl: './emploi-du-temps.html',
  styleUrl: './emploi-du-temps.css',
})
export class EmploiDuTemps implements OnInit{
 private svc = inject(SeanceService);
 private router = inject(Router);
 seances = signal<any[]>([]);
 filtreEnseignant = signal('');
 filtreCours = signal('');
 semaine = signal(this.semaineISO());
 annee = signal(new Date().getFullYear());
 jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
 horaires = ['08:00','09:00','10:00','11:00','12:00',
'13:00','14:00','15:00','16:00','17:00','18:00'];
couleurs = ['card-pink','card-teal','card-violet','card-cyan','card-purple'];
couleurMap = new Map<number , string>();
seanceFiltre = computed(()=> this.seances().filter(
  s =>s.enseignant_nom.toLowerCase().includes(this.filtreEnseignant().toLowerCase()) && s.cour_intitule.toLowerCase().includes(this.filtreEnseignant().toLowerCase().includes(this.filtreCours().toLowerCase() ))
));
 ngOnInit(): void {
   this.charger();
 }

 charger(){
  this.svc.getBySemaine(this.semaine() , this.annee()).subscribe((d: any)=>{
    this,this.seances.set(d);
    d.forEach((s: any , i: number)=>{
      if(!this.couleurMap.has(s.cour_id)){
        this.couleurMap.set(s.cour_id , this.couleurs[this.couleurMap.size % this.couleurs.length]);
      }
    });
  });
 }
 getSeance(jour: string , heure: string){
  return this.seanceFiltre().find(s => s.jour_nom === jour && s.heure_debut === heure);
 }
 getCouleur(s: any){
  return this.couleurMap.get(s.cour_id) || 'card-purple';
}

semaineSuiv(){
  this.semaine.update(s=> s + 1);
  this.charger();
}

semainePrec(){
  this.semaine.update(s=> s > 1 ? s - 1 : s);
  this.charger();
}

goAdmin(){
  this.router.navigate(['/login']);
}

semaineISO(){
  const n = new Date() , s = new Date(n.getFullYear(),0,1);
  return Math.ceil((((n.getTime() - s.getTime()) / 86400000) + s.getDay() + 1) / 7);
}



}



