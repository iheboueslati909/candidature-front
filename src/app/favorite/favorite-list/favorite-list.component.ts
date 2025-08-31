import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../favorite.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  template: `
  <mat-card>
    <mat-card-title>Favoris (épingler une offre)</mat-card-title>

    <form (submit)="add($event)" style="display:flex; gap:8px; align-items:center; margin-top:8px">
      <mat-form-field appearance="fill" style="flex:1">
        <mat-label>Titre de l'offre</mat-label>
        <input matInput [(ngModel)]="title" name="title" required />
      </mat-form-field>
      <button mat-flat-button color="primary" type="submit">Épingler</button>
    </form>

    <mat-list style="margin-top:12px">
      <mat-list-item *ngFor="let f of favs">
        <div mat-line>{{ f.title }}</div>
        <button mat-button color="warn" (click)="remove(f.title)">Retirer</button>
      </mat-list-item>
    </mat-list>
  </mat-card>
  `
})
export class FavoriteListComponent {
  title = '';
  favs: any[] = [];
  constructor(private svc: FavoriteService){ this.load(); }
  async load(){ this.favs = await this.svc.listForUser(0) as any[]; }
  async add(e: Event){ e.preventDefault(); const item = { title: this.title, userId: 0 }; await this.svc.add(item); await this.load(); this.title=''; }
  remove(t: string){ this.favs = this.favs.filter(f=>f.title!==t); }
}
