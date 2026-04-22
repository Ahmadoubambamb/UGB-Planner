import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoursService } from '../../core/services/cours-service';

@Component({
  selector: 'app-cours',
  imports: [CommonModule, FormsModule],
  templateUrl: './cours.html',
  styleUrl: './cours.css',
})
export class Cours implements OnInit {
private svc = inject(CoursService);
coursList = signal<any[]>([]);
showModal = signal(false);
editMode = signal(false);
form = signal({ id:0, intitule:'', code:'', credits:3 });

  ngOnInit(): void {
    this.reload();
  }

  reload(){
    this.svc.getAll().subscribe((d: any) => this.coursList.set(d));
  }

  openCreate(){
 this.form.set({id:0,intitule:'',code:'',credits:3});
this.editMode.set(false); this.showModal.set(true); 
}

openEdit(c: any) { this.form.set({...c});
this.editMode.set(true); this.showModal.set(true); }
save() {
const obs = this.editMode()
? this.svc.update(this.form().id, this.form())
: this.svc.create(this.form());
obs.subscribe(() => { this.reload(); this.showModal.set(false); });
}
delete(id: number) {
if (confirm('Supprimer ?'))
this.svc.delete(id).subscribe(() => this.reload());
}
set(k: string, v: any) { this.form.update(f => ({...f, [k]: v})); }

}
