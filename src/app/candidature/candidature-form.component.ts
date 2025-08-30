import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CandidatureService } from './candidature.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-candidature-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Nouvelle candidature</h3>
  <form (submit)="create($event)">
    <label>Nom étudiant: <input [(ngModel)]="studentName" name="studentName" required></label><br />
    <label>Moyenne: <input type="number" [(ngModel)]="moyenne" name="moyenne"></label><br />
    <label>Date début: <input type="date" [(ngModel)]="dateDebut" name="dateDebut"></label><br />
    <label>Etablissement: <input [(ngModel)]="etab" name="etab"></label><br />
    <button type="submit">Créer</button>
  </form>
  <p *ngIf="created">Candidature créée</p>
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
