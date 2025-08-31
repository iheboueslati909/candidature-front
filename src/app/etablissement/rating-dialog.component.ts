import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingService } from '../rating/rating.service';
import { AuthService } from '../auth/auth.service';
import { EtablissementResponse } from './etablissement.service';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule, ReactiveFormsModule],
  template: `
    <h3 style="margin-left:12px;margin-right:12px"  mat-dialog-title>Noter {{ data.nom }}</h3>
    <div style="margin-top:8px;margin-left:12px;margin-right:12px">
      <mat-form-field appearance="fill" style="width:100%">
        <mat-label>Score (1-5)</mat-label>
        <input matInput type="number" [formControl]="scoreControl" min="1" max="5" />
      </mat-form-field>
    </div>
    <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px">
      <button mat-stroked-button (click)="close(false)">Annuler</button>
      <button mat-flat-button color="primary" (click)="submit()">Envoyer</button>
    </div>
  `
})
export class RatingDialogComponent {
  dialogRef = inject(MatDialogRef<RatingDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as EtablissementResponse;
  ratingSvc = inject(RatingService);
  auth = inject(AuthService);

  scoreControl = new FormControl(5);

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  async submit() {
    const userId = this.auth.getUserId();
    if (!userId) { alert('Veuillez vous connecter'); return; }
    const score = Number(this.scoreControl.value) || 5;
    try {
      await this.ratingSvc.submit({ userId, etablissementId: this.data.id, score });
      this.dialogRef.close(true);
    } catch (e) {
      alert('Erreur lors de l envoi de la note');
    }
  }
}
