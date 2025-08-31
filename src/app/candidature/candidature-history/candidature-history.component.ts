import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidatureService } from '../candidature.service';
import { AuthService } from '../../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-candidature-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  template: `
    <mat-card>
      <mat-card-title>Historique des candidatures</mat-card-title>
      <mat-list>
        <mat-list-item *ngFor="let c of items()">
          <div mat-line>{{ c.createdAt | date:'short' }} — {{ c.studentName }} — {{ c.moyenne }}</div>
          <div mat-line><strong>{{ c.status }}</strong></div>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class CandidatureHistoryComponent {
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

    this.items.set(sorted);
  }
}
