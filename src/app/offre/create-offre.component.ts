import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreService } from './offre.service';
import { EtablissementService } from '../etablissement/etablissement.service';
import { AuthService } from '../auth/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-offre',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule],
  template: `
    <mat-card >
      <mat-card-title>Créer une offre</mat-card-title>
      <form (ngSubmit)="submit()" style="display:flex; flex-direction:column; gap:12px; margin-top:12px;margin-right:12px;margin-left:12px;margin-bottom:12px;">
        <mat-form-field appearance="fill">
          <mat-label>Titre</mat-label>
          <input matInput name="titre" [(ngModel)]="titre" required />
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Description</mat-label>
          <textarea matInput name="description" [(ngModel)]="description"></textarea>
        </mat-form-field>

        <div style="display:flex; gap:8px">
          <mat-form-field appearance="fill" style="flex:1">
            <mat-label>Date début</mat-label>
            <input matInput type="date" name="dateDebut" [(ngModel)]="dateDebut" required />
          </mat-form-field>
          <mat-form-field appearance="fill" style="flex:1">
            <mat-label>Date fin</mat-label>
            <input matInput type="date" name="dateFin" [(ngModel)]="dateFin" required />
          </mat-form-field>
        </div>

        <mat-form-field appearance="fill">
          <mat-label>Etablissement</mat-label>
          <mat-select name="etablissementId" [(ngModel)]="etablissementId" required>
            <mat-option [value]="null">-- Choisir --</mat-option>
            <mat-option *ngFor="let e of etablissements" [value]="e.id">{{e.nom}} ({{e.pays}})</mat-option>
          </mat-select>
        </mat-form-field>

        <div style="display:flex; gap:8px; margin-top:8px">
          <button mat-flat-button color="primary" type="submit">Créer</button>
        </div>

        <p *ngIf="message">{{message}}</p>
      </form>
    </mat-card>
  `
})
export class CreateOffreComponent {
  titre = '';
  description = '';
  dateDebut = '';
  dateFin = '';
  etablissementId: number | null = null;
  etablissements: any[] = [];
  message: string | null = null;

  constructor(private svc: OffreService, private etabSvc: EtablissementService, private auth: AuthService) {
    this.loadEtablissements();
  }

  async loadEtablissements() {
    try {
      this.etablissements = await this.etabSvc.list();
    } catch (err) {
      console.error(err);
    }
  }

  async submit() {
  const role = (this.auth.getRole() || '').toLowerCase();
  if (role === 'candidat') {
    this.message = 'Vous n\'avez pas le droit de créer une offre.';
    return;
  }

  if (!this.etablissementId) {
    this.message = 'Veuillez choisir un établissement';
    return;
  }

  if(!this.dateDebut || !this.dateFin) {
    this.message = 'Veuillez renseigner les dates';
    return;
  }

  if (!this.dateDebut || !this.dateFin) {
    this.message = 'Veuillez renseigner les dates';
    return;
  }

  const debut = new Date(this.dateDebut);
  const fin = new Date(this.dateFin);
  if (debut >= fin) {
    this.message = 'La date de début doit être antérieure à la date de fin.';
    return;
  }

  try {
    const created = await this.svc.create({
      titre: this.titre,
      description: this.description,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      etablissementId: this.etablissementId
    });
    this.message = 'Offre créée (id=' + created.id + ')';

    // reset form
    this.titre = '';
    this.description = '';
    this.dateDebut = '';
    this.dateFin = '';
    this.etablissementId = null;
  } catch (err: any) {
    console.error(err);
    this.message = err?.message ?? 'Erreur lors de la création';
  }
}

}
