import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RatingService } from '../rating/rating.service';
import { EtablissementResponse } from './etablissement.service';
import { AuthUserService } from '../DTO/auth-user.service';

@Component({
  selector: 'app-rating-dialog',
  standalone: true,
  styleUrls: ['./rating-dialog.component.css'],
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
        <h3 class="popup-title">Noter {{ data.nom }}</h3>
      </div>

      <div class="popup-body">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Score (1-5)</mat-label>
          <input matInput type="number" [formControl]="scoreControl" min="1" max="5" />
        </mat-form-field>
      </div>

      <div class="popup-actions">
        <button mat-stroked-button class="btn-cancel" (click)="close(false)">
          Annuler
        </button>
        <button mat-flat-button class="btn-submit" (click)="submit()">
          Envoyer
        </button>
      </div>
    </div>
  `
})
export class RatingDialogComponent {
  dialogRef = inject(MatDialogRef<RatingDialogComponent>);
  data = inject(MAT_DIALOG_DATA) as EtablissementResponse;
  ratingSvc = inject(RatingService);
  auth = inject(AuthUserService);

  scoreControl = new FormControl(5);

  close(result: boolean) {
    this.dialogRef.close(result);
  }

  async submit() {
    const userId = this.auth.getUserId();
    if (!userId) {
      alert('Veuillez vous connecter');
      return;
    }
    const score = Number(this.scoreControl.value) || 5;
    try {
      await this.ratingSvc.submit({ userId, etablissementId: this.data.id, score });
      this.dialogRef.close(true);
    } catch (e) {
      alert('Erreur lors de l’envoi de la note');
    }
  }
}
