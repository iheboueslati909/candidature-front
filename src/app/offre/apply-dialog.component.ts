import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CandidatureService } from '../candidature/candidature.service';
import { AuthUserService } from '../DTO/auth-user.service';
import { ProfileEtudiantService } from '../profile/profile-etudiant.service';

@Component({
  selector: 'app-apply-dialog',
  standalone: true,
  styleUrls: ['./apply-dialog.component.css'],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="popup-container">
      <div class="popup-header">
        <h3 class="popup-title">Postuler à l'offre</h3>
      </div>

      <div class="popup-body">
        <form [formGroup]="form">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Nom étudiant</mat-label>
            <input matInput formControlName="studentName" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Moyenne</mat-label>
            <input matInput type="number" formControlName="moyenne" />
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Date début</mat-label>
            <input matInput type="date" formControlName="dateDebut" />
          </mat-form-field>
        </form>
      </div>

      <div class="popup-actions">
        <button mat-stroked-button class="btn-cancel" (click)="close(false)">Annuler</button>
        <button mat-flat-button class="btn-submit" (click)="confirm()" [disabled]="loading">
          Confirmer
        </button>
      </div>

      <p *ngIf="success" class="popup-success">{{ success }}</p>
    </div>
  `
})
export class ApplyDialogComponent {
  dialogRef = inject(MatDialogRef<ApplyDialogComponent>);
  data = inject(MAT_DIALOG_DATA);
  candidatureSvc = inject(CandidatureService);
  auth = inject(AuthUserService);
  profileSvc = inject(ProfileEtudiantService);

  loading = false;
  success: string | null = null;

form = new FormGroup({
  studentName: new FormControl({ value: '', disabled: true }),
  moyenne: new FormControl({ value: 10, disabled: true }),
  dateDebut: new FormControl({ value: '', disabled: true })
});

  constructor() {
    const offer = this.data?.offer;
    if (offer) {
      this.form.patchValue({ dateDebut: offer.dateDebut?.slice(0, 10) ?? new Date().toISOString().slice(0, 10) });
    }
    const userId = this.auth.getUserId();
    if (userId) {
      this.profileSvc.getByUserId(userId).then(p => { if (p?.moyenne != null) this.form.patchValue({ moyenne: p.moyenne }); });
      this.form.patchValue({ studentName: this.auth.getFullName() ?? '' });
    }
  }

  close(value: boolean) { this.dialogRef.close(value); }

  async confirm() {
    const offerId = this.data?.offer?.id;
    const userId = this.auth.getUserId();
    if (!offerId || !userId) { alert('Veuillez vous connecter.'); return; }
    const moyenne = Number(this.form.value.moyenne) || 0;

    this.loading = true;
    try {
      const { studentName, dateDebut } = this.form.value;
      
      if (!studentName || !dateDebut  ) { alert('Veuillez remplir tous les champs.'); this.loading = false; return; }
      
      await this.candidatureSvc.create({
        userId,
        studentName,
        moyenne,
        dateDebutMobilite: dateDebut,
        offreId: offerId
      });
      this.success = 'Candidature créée';
      setTimeout(() => this.dialogRef.close(true), 800);
    } catch {
      alert('Erreur lors de la création de la candidature');
      this.dialogRef.close(false);
    } finally { this.loading = false; }
  }
}
