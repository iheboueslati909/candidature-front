import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from './candidature.service';
import { AuthService } from '../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
  <mat-card>
    <mat-card-title>Nouvelle candidature</mat-card-title>
    <form (submit)="create($event)" class="form">
      <mat-form-field appearance="outline" class="full">
        <mat-label>Nom étudiant</mat-label>
        <input matInput [(ngModel)]="studentName" name="studentName" required />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Moyenne</mat-label>
        <input matInput type="number" [(ngModel)]="moyenne" name="moyenne" />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Date début</mat-label>
        <input matInput type="date" [(ngModel)]="dateDebut" name="dateDebut" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full">
        <mat-label>Etablissement</mat-label>
        <input matInput [(ngModel)]="etab" name="etab" />
      </mat-form-field>

      <div class="actions">
        <button mat-flat-button color="primary" type="submit">Créer</button>
      </div>
    </form>

    <mat-card-subtitle *ngIf="created">Candidature créée</mat-card-subtitle>
  </mat-card>
  `
})
export class CandidatureFormComponent {
  studentName = '';
  moyenne = 10;
  dateDebut = '';
  etab = '';
  created = false;
  constructor(private svc: CandidatureService, private auth: AuthService) {}
  async create(e: Event){
    e.preventDefault();
    const userId = this.auth.getUserId() ?? undefined;
    await this.svc.create({ userId, studentName: this.studentName, moyenne: this.moyenne, dateDebutMobilite: this.dateDebut, etablissementName: this.etab });
    this.created=true; setTimeout(()=>this.created=false,2000); this.studentName='';
  }
}
