import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { CandidatureService } from '../candidature.service';
import { AuthUserService } from '../../DTO/auth-user.service';

@Component({
  selector: 'app-candidature-history',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule],
  templateUrl: './candidature-history.component.html',
  styleUrls: ['./candidature-history.component.css']
})
export class CandidatureHistoryComponent {
  items = signal<any[]>([]);
  displayedColumns: string[] = ['createdAt', 'studentName', 'moyenne', 'status'];

  constructor(private svc: CandidatureService, private auth: AuthUserService) {
    this.load();
  }

  async load() {
    const userId = this.auth.getUserId();
    console.log("CandidatureHistoryComponent load for userId=", userId);

    const all = userId ? await this.svc.listByUser(userId) : [];
    const sorted = all.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    this.items.set(sorted);
  }
}
