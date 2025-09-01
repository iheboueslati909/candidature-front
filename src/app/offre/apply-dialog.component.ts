import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Inject } from '@angular/core';
import { CandidatureService } from '../candidature/candidature.service';
import { AuthUserService } from '../DTO/auth-user.service';
import { ProfileEtudiantService } from '../profile/profile-etudiant.service';

@Component({
  selector: 'app-apply-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  template: `
    <mat-card>
      <mat-card-title>Postuler à l'offre</mat-card-title>
      <div>
        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Nom étudiant</mat-label>
          <input matInput [(ngModel)]="studentName" name="studentName" />
        </mat-form-field>

        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Moyenne</mat-label>
          <input matInput type="number" [(ngModel)]="moyenne" name="moyenne" />
        </mat-form-field>

        <mat-form-field appearance="fill" style="width:100%">
          <mat-label>Date début</mat-label>
          <input matInput type="date" [(ngModel)]="dateDebut" name="dateDebut" />
        </mat-form-field>
      </div>
      <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:12px">
        <button mat-stroked-button (click)="close(false)">Annuler</button>
        <button mat-flat-button color="primary" (click)="confirm()" [disabled]="loading">Confirmer</button>
      </div>
      <p *ngIf="success" style="margin-top:8px">{{ success }}</p>
    </mat-card>
  `
})
export class ApplyDialogComponent {
  studentName = '';
  moyenne = 10;
  dateDebut = '';
  loading = false;
  success: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<ApplyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private candidatureSvc: CandidatureService,
    private auth: AuthUserService,
    private profileSvc: ProfileEtudiantService
  ) {
    const offer = data?.offer;
    if (offer) this.dateDebut = offer.dateDebut?.slice(0,10) ?? new Date().toISOString().slice(0,10);
    const userId = this.auth.getUserId();
    if (userId) {
      this.profileSvc.getByUserId(userId).then(p => { if (p?.moyenne != null) this.moyenne = p.moyenne; });
      this.studentName = this.auth.getFullName() ?? '';
    }
  }

  close(value: boolean) { this.dialogRef.close(value); }

  async confirm() {
    const offerId = this.data?.offer?.id;
    const userId = this.auth.getUserId();
    if (!offerId || !userId) { alert('Veuillez vous connecter.'); return; }
    this.loading = true;
    try {
      await this.candidatureSvc.create({ userId, studentName: this.studentName, moyenne: this.moyenne, dateDebutMobilite: this.dateDebut, offreId: offerId });
      this.success = 'Candidature créée';
      setTimeout(() => this.dialogRef.close(true), 800);
    } catch (err) {
      alert('Erreur lors de la création de la candidature');
      this.dialogRef.close(false);
    } finally { this.loading = false; }
  }
}
