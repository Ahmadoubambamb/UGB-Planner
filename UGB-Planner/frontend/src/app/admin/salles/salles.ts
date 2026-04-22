import { Component, inject, OnInit, signal } from '@angular/core';
import { SalleService } from '../../core/services/salle-service';

@Component({
  selector: 'app-salles',
  imports: [],
  templateUrl: './salles.html',
  styleUrl: './salles.css',
})
export class Salles implements OnInit {

  private svc = inject(SalleService);
  salles = signal<any[]>([]);

  showModal = signal(false);
editMode = signal(false);
form = signal({ id:0, nom:'', batiment:'', capacite:30 });
ngOnInit() { this.reload(); }
reload() { this.svc.getAll().subscribe((d: any) => this.salles.set(d)); }
openCreate() { this.form.set({id:0,nom:'',batiment:'',capacite:30});
this.editMode.set(false); this.showModal.set(true); }
openEdit(s: any) { this.form.set({...s});
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
