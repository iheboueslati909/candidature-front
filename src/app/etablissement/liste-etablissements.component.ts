import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MailSendComponent } from '../mail/mail-send/mail-send.component';
import { EtablissementService, EtablissementResponse } from './etablissement.service';
import { RatingService } from '../rating/rating.service';
import { AuthService } from '../auth/auth.service';
import { RatingDialogComponent } from './rating-dialog.component';

@Component({
  selector: 'app-liste-etablissements',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatCardModule, MatDialogModule, MailSendComponent],
  template: `
    <h3>Liste des établissements</h3>
    <mat-card>
      <mat-list>
        <mat-list-item *ngFor="let e of etablissements()">
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%">
            <div>
              <div><strong>{{ e.nom }}</strong> — {{ e.pays }}</div>
              <div style="display:flex; align-items:center; gap:6px; margin-top:4px">
                <mat-icon color="warn">star_rate</mat-icon>
                <span>Rating: {{ e.averageRating || 'n/a' }}</span>
              </div>
            </div>

            <div style="min-width:160px; display:flex; gap:8px; justify-content:flex-end">
              <button mat-stroked-button color="accent" (click)="openRate(e)">Noter</button>
            </div>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `
})
export class ListeEtablissementsComponent {
  etablissements = signal<EtablissementResponse[]>([]);


  constructor(private svc: EtablissementService, private ratingSvc: RatingService, private auth: AuthService, private dialog: MatDialog) {
    this.load();
  }

  async load() {
    this.etablissements.set(await this.svc.list());
  }

  openRate(e: EtablissementResponse) {
    const ref = this.dialog.open(RatingDialogComponent, { data: e
     });
    ref.afterClosed().subscribe((result) => {
      // if dialog submitted, refresh list
      if (result === true) this.load();
    });
  }

}
