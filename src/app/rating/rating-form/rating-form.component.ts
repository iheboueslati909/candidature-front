import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const STORAGE_KEY = 'app_ratings_v1';

@Component({
  selector: 'app-rating-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Noter un établissement</h3>
  <form (submit)="save($event)">
    <label>Etablissement: <input [(ngModel)]="etab" name="etab" required></label><br />
    <label>Score (1-5): <input type="number" [(ngModel)]="score" name="score"></label><br />
    <button type="submit">Enregistrer</button>
  </form>
  <p *ngIf="saved">Sauvegardé</p>
  `
})
export class RatingFormComponent {
  etab = '';
  score = 5;
  saved = false;
  save(e: Event) {
    e.preventDefault();
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    arr.push({ etab: this.etab, score: this.score, createdAt: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
    this.saved = true; setTimeout(()=> this.saved = false,2000);
  }
}
