import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from '../candidature.service';
import { CandidatureResponse } from '../candidature.model';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Liste des candidatures</h3>

    <div>
      Filtrer: 
      <select [ngModel]="filter()" (ngModelChange)="filter.set($event); reload()">
        <option value="">Tous</option>
        <option value="PENDING">En attente</option>
        <option value="ACCEPTED">Accepté</option>
        <option value="REFUSED">Refusé</option>
      </select>

      <button (click)="sort()">
        Trier par moyenne {{ desc() ? '(desc)' : '(asc)' }}
      </button>
    </div>

    <ul>
      @for (c of items(); track c.id) {
        <li>
          <strong>{{ c.studentName }}</strong> — 
          {{ c.moyenne }} — 
          {{ c.dateDebutMobilite | date }} — 
          {{ c.etablissementName }} — 
          <em>{{ c.status }}</em>

          <button (click)="accept(c)">Accept</button>
          <button (click)="refuse(c)">Refuse</button>
          <button (click)="hold(c)">Hold</button>
          <button (click)="del(c.id)">Delete</button>
        </li>
      }
    </ul>
  `
})
export class CandidatureListComponent {
  items = signal<CandidatureResponse[]>([]);
  filter = signal<string>('');
  desc = signal<boolean>(true);

  constructor(private svc: CandidatureService) {
    this.reload();
  }

  async accept(c: CandidatureResponse) {
  await this.svc.updateStatus(c.id, 'ACCEPTED');
    await this.reload();
  }

  async refuse(c: CandidatureResponse) {
  await this.svc.updateStatus(c.id, 'REFUSED');
    await this.reload();
  }

  async hold(c: CandidatureResponse) {
  await this.svc.updateStatus(c.id, 'WAITING_LIST');
    await this.reload();
  }

  async del(id: number) {
    await this.svc.delete(id);
    await this.reload();
  }

  async sort() {
    this.desc.set(!this.desc());
    const sorted = await this.svc.sortByMoyenne();
    const list = this.desc() ? sorted.slice() : sorted.slice().reverse();
    this.items.set(this.filter() ? list.filter(c => c.status === this.filter()) : list);
  }

  async applyFilter() {
    const all = this.filter()
      ? await this.svc.filterByStatus(this.filter())
      : await this.svc.listAll();

    this.items.set(this.desc() ? all.slice() : all.slice().reverse());
  }

  async reload() {
    await this.applyFilter();
  }
}
