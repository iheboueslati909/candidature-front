import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EtablissementService, EtablissementResponse } from './etablissement.service';
import { RatingDialogComponent } from './rating-dialog.component';

@Component({
  selector: 'app-liste-etablissements',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  templateUrl: './liste-etablissements.component.html',
  styleUrls: ['./liste-etablissements.component.css']
})
export class ListeEtablissementsComponent {
  etablissements = signal<EtablissementResponse[]>([]);
  displayedColumns = ['nom', 'pays', 'rating', 'actions'];

  constructor(
    private svc: EtablissementService,
    private dialog: MatDialog
  ) {
    this.load();
  }

  async load() {
    this.etablissements.set(await this.svc.list());
  }

  openRate(e: EtablissementResponse) {
    const ref = this.dialog.open(RatingDialogComponent, { data: e });
    ref.afterClosed().subscribe((result) => {
      if (result === true) this.load();
    });
  }
}
