import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreService } from './offre.service';
import { EtablissementService } from '../etablissement/etablissement.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-create-offre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Créer une offre</h3>
    <form (ngSubmit)="submit()">
      <label>Titre
        <input name="titre" [(ngModel)]="titre" required />
      </label>
      <label>Description
        <textarea name="description" [(ngModel)]="description"></textarea>
      </label>
      <label>Date début
        <input type="date" name="dateDebut" [(ngModel)]="dateDebut" required />
      </label>
      <label>Date fin
        <input type="date" name="dateFin" [(ngModel)]="dateFin" required />
      </label>
      <label>Etablissement
        <select name="etablissementId" [(ngModel)]="etablissementId" required>
          <option [ngValue]="null">-- Choisir --</option>
          <option *ngFor="let e of etablissements" [ngValue]="e.id">{{e.nom}} ({{e.pays}})</option>
        </select>
      </label>
      <div style="margin-top:8px">
        <button type="submit">Créer</button>
      </div>
      <p *ngIf="message">{{message}}</p>
    </form>
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
