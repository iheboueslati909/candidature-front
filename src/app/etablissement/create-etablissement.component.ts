import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { EtablissementService } from './etablissement.service';

@Component({
  selector: 'app-create-etablissement',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './create-etablissement.component.html',
  styleUrls: ['./create-etablissement.component.css']
})
export class CreateEtablissementComponent {
  @ViewChild('etabForm', { static: false }) etabForm!: NgForm;

  nom = '';
  pays = '';
  success: string | null = null;
  loading = false;

  constructor(private svc: EtablissementService) {}

  async create() {
    if (this.loading) return;
    this.loading = true;
    this.success = null;

    try {
      await this.svc.create({ nom: this.nom, pays: this.pays });

      if (this.etabForm) {
        this.etabForm.resetForm();
      }
    } catch (err) {
      console.error(err);
      this.success = '❌ Erreur lors de la création';
    } finally {
      this.loading = false;
    }
  }

  reset() {
    if (this.etabForm) {
      this.etabForm.resetForm();
    }
  }
}
