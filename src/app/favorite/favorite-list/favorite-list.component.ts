import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoriteService } from '../favorite.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Favoris (épingler une offre)</h3>
  <form (submit)="add($event)">
    <input [(ngModel)]="title" name="title" placeholder="Titre de l'offre" required>
    <button type="submit">Épingler</button>
  </form>
  <ul>
    <li *ngFor="let f of favs">{{f.title}} <button (click)="remove(f.title)">Retirer</button></li>
  </ul>
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
