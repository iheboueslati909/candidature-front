import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { CandidatureService } from '../candidature.service';
import { CandidatureResponse } from '../candidature.model';

@Component({
  selector: 'app-candidature-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './candidature-list.component.html',
  styleUrls: ['./candidature-list.component.css']
})
export class CandidatureListComponent {
  items = signal<CandidatureResponse[]>([]);
  filter = signal<string>('');
  desc = signal<boolean>(true);

  displayedColumns = ['student', 'etablissement', 'offre', 'moyenne', 'date', 'status', 'actions'];

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
