import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CandidatureService } from './candidature.service';
import { AuthUserService } from '../DTO/auth-user.service';

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-card class="candidature-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon color="primary">add_circle</mat-icon> Nouvelle Candidature
        </mat-card-title>
        <mat-card-subtitle *ngIf="created" class="success-message">
          <mat-icon>done</mat-icon> Candidature créée avec succès !
        </mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <form (ngSubmit)="create($event)" class="candidature-form">
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom de l'étudiant</mat-label>
              <input matInput [(ngModel)]="studentName" name="studentName" required />
              <mat-icon matSuffix>person</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Moyenne</mat-label>
              <input matInput type="number" [(ngModel)]="moyenne" name="moyenne" />
              <mat-icon matSuffix>grade</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Date de début</mat-label>
              <input matInput type="date" [(ngModel)]="dateDebut" name="dateDebut" />
              <mat-icon matSuffix>calendar_today</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Établissement</mat-label>
              <input matInput [(ngModel)]="etab" name="etab" />
              <mat-icon matSuffix>school</mat-icon>
            </mat-form-field>
          </div>
          
          <div class="form-actions">
            <button mat-raised-button color="primary" type="submit">
              <mat-icon>add</mat-icon> Créer
            </button>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    :host {
      display: flex;
      justify-content: center;
      padding: 24px;
      background-color: #f5f5f5; /* Light grey background for the page */
    }

    .candidature-card {
      max-width: 600px;
      width: 100%;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* Soft shadow */
    }

    .mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .mat-card-subtitle {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 10px;
      font-style: italic;
      color: #666;
    }
    
    .success-message {
      color: #4CAF50 !important; /* Green color for success */
      font-weight: 500;
    }

    .candidature-form {
      margin-top: 20px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-actions {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end; /* Align button to the right */
    }

    button[mat-raised-button] {
      padding: 8px 24px;
      font-size: 16px;
      font-weight: 500;
    }
  `]
})
export class CandidatureFormComponent {
  studentName = '';
  moyenne = 10;
  dateDebut = '';
  etab = '';
  created = false;
  constructor(private svc: CandidatureService, private auth: AuthUserService) {}
  async create(e: Event) {
    e.preventDefault();
    const userId = this.auth.getUserId() ?? undefined;
    await this.svc.create({ userId, studentName: this.studentName, moyenne: this.moyenne, dateDebutMobilite: this.dateDebut, etablissementName: this.etab });
    this.created = true;
    setTimeout(() => this.created = false, 2000);
    this.studentName = '';
    this.moyenne = 10;
    this.dateDebut = '';
    this.etab = '';
  }
}