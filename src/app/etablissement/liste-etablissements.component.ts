import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EtablissementService, EtablissementResponse } from './etablissement.service';
import { RatingService } from '../rating/rating.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-liste-etablissements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3>Liste des établissements</h3>
    <div style="position:relative">
      <ul>
        <li *ngFor="let e of etablissements()">
          <strong>{{ e.nom }}</strong> — {{ e.pays }} — Rating: {{ e.averageRating || 'n/a' }}
          <button (click)="openRate(e)">Noter</button>
        </li>
      </ul>

      <div *ngIf="selectedEtab() !== null" style="position:absolute; left:0; right:0; top:100%; margin-top:8px; background:#fff; border:1px solid #ccc; padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.12); z-index:50">
        <div style="display:flex; justify-content:space-between; align-items:center">
          <strong>Noter l'établissement</strong>
          <button (click)="closeRate()" style="background:none;border:none">✕</button>
        </div>
        <div style="margin-top:8px">
          <label>Score (1-5): <input type="number" [value]="score()" (input)="score.set($any($event.target).valueAsNumber)" min="1" max="5" /></label>
        </div>
        <div style="margin-top:8px">
          <button (click)="submitRating()">Envoyer</button>
          <button (click)="closeRate()">Annuler</button>
        </div>
      </div>
    </div>
  `
})
export class ListeEtablissementsComponent {
  etablissements = signal<EtablissementResponse[]>([]);

  // rating popup state
  selectedEtab: WritableSignal<number | null> = signal(null);
  score: WritableSignal<number> = signal(5);

  constructor(private svc: EtablissementService, private ratingSvc: RatingService, private auth: AuthService) {
    this.load();
  }

  async load() {
    this.etablissements.set(await this.svc.list());
  }

  openRate(e: EtablissementResponse) {
    this.selectedEtab.set(e.id);
    this.score.set(5);
  }

  closeRate(){ this.selectedEtab.set(null); }

  async submitRating(){
    const etabId = this.selectedEtab();
    if (!etabId) return;
    const userId = this.auth.getUserId();
    if (!userId) { alert('Veuillez vous connecter'); return; }
    try {
      await this.ratingSvc.submit({ userId, etablissementId: etabId, score: this.score() });
      this.closeRate();
      // optionally reload list
      this.load();
    } catch {
      alert('Erreur lors de l envoi de la note');
    }
  }
}
