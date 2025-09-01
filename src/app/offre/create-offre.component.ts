import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { OffreService } from './offre.service';
import { EtablissementService } from '../etablissement/etablissement.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthUserService } from '../DTO/auth-user.service';

@Component({
  selector: 'app-create-offre',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-offre.component.html',
  styleUrls: ['./create-offre.component.css']
})
export class CreateOffreComponent {
@ViewChild('offreForm') offreForm?: NgForm;

  titre = '';
  description = '';
  dateDebut = '';
  dateFin = '';
  etablissementId: number | null = null;
  etablissements: any[] = [];
  message: string | null = null;
  loading = false;

  constructor(
    private svc: OffreService,
    private etabSvc: EtablissementService,
    private auth: AuthUserService
  ) {
    this.loadEtablissements();
  }

  async loadEtablissements() {
    try {
      this.etablissements = await this.etabSvc.list();
    } catch (err) {
      console.error(err);
    }
  }

  get roles(): string[] {
    return (this.auth.getRoles() || []).map(r => r.toUpperCase());
  }
  isSuperAdmin(): boolean {
    return this.roles.includes('SUPER_ADMIN');
  }

  async submit() {
    if (this.loading) return;
    this.loading = true;
    this.message = null;

    try {
      if (!this.isSuperAdmin()) {
        this.message = 'Vous n\'avez pas le droit de créer une offre.';
        return;
      }

      if (!this.etablissementId) {
        this.message = 'Veuillez choisir un établissement';
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

      const created = await this.svc.create({
        titre: this.titre,
        description: this.description,
        dateDebut: this.dateDebut,
        dateFin: this.dateFin,
        etablissementId: this.etablissementId
      });

    this.offreForm?.resetForm();

    } catch (err: any) {
      console.error(err);
      this.message = err?.message ?? 'Erreur lors de la création';
    } finally {
      this.loading = false;
    }
  }
}
