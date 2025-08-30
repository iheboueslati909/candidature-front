import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatureService } from '../candidature.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-candidature-history',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Historique des candidatures</h3>
    <ul>
      @for (c of items(); track c.id) {
        <li>
          {{ c.createdAt | date:'short' }} — 
          {{ c.studentName }} — 
          {{ c.moyenne }} — 
          <strong>{{ c.status }}</strong>
        </li>
      }
    </ul>
  `
})
export class CandidatureHistoryComponent {
  // ✅ signal for reactive updates
  items = signal<any[]>([]);

  constructor(private svc: CandidatureService, private auth: AuthService) {
    this.load();
  }

  async load() {
    const userId = this.auth.getUserId();

    const all = userId ? await this.svc.listByUser(userId) : [];
    const sorted = all.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    this.items.set(sorted); // ✅ trigger change detection
  }
}
