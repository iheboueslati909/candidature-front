import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OffreService, OffreResponse } from './offre.service';
import { CandidatureService } from '../candidature/candidature.service';
import { ProfileEtudiantService } from '../profile/profile-etudiant.service';
import { FavoriteService } from '../favorite/favorite.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';
import { MailSendComponent } from '../mail/mail-send/mail-send.component';

@Component({
  selector: 'app-liste-offres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatButtonModule, MatCheckboxModule, MatIconModule, MatListModule, MatFormFieldModule, MatInputModule, MatDialogModule, MailSendComponent],
  template: `
    <mat-card>
      <mat-card-title>Liste des offres</mat-card-title>

      <table mat-table [dataSource]="offres()" style="width:100%">
        <ng-container matColumnDef="fav" *ngIf="isCandidat()">
          <th mat-header-cell *matHeaderCellDef> Fav </th>
          <td mat-cell *matCellDef="let o"> <mat-checkbox [checked]="isFavorite(o.id)" (change)="toggleFavorite(o.id, $event.checked)"></mat-checkbox> </td>
        </ng-container>

        <ng-container matColumnDef="apply" *ngIf="isCandidat()">
          <th mat-header-cell *matHeaderCellDef> Postuler </th>
          <td mat-cell *matCellDef="let o"> <button mat-button (click)="openApply(o)">Postuler</button> </td>
        </ng-container>

        <ng-container matColumnDef="titre">
          <th mat-header-cell *matHeaderCellDef> Titre </th>
          <td mat-cell *matCellDef="let o"> {{o.titre}} </td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef> Description </th>
          <td mat-cell *matCellDef="let o"> {{o.description}} </td>
        </ng-container>

        <ng-container matColumnDef="periode">
          <th mat-header-cell *matHeaderCellDef> Période </th>
          <td mat-cell *matCellDef="let o"> {{o.dateDebut | date}} — {{o.dateFin | date}} </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef> Status </th>
          <td mat-cell *matCellDef="let o"> {{o.active ? 'active' : 'inactive'}} </td>
        </ng-container>

        <ng-container matColumnDef="email" *ngIf="!isCandidat()">
          <th mat-header-cell *matHeaderCellDef> Email </th>
          <td mat-cell *matCellDef="let o"> <button mat-button (click)="openSendEmail(o.id)">Envoyer</button> </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <!-- Apply popup (simple card) -->
      <div *ngIf="selectedOffre() !== null" style="position:absolute; left:0; right:0; top:100%; margin-top:8px">
        <mat-card>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>Postuler à l'offre</strong>
            <button mat-icon-button (click)="cancelApply()"><mat-icon>close</mat-icon></button>
          </div>
          <div style="margin-top:8px">
            <mat-form-field appearance="fill" style="width:100%">
              <mat-label>Nom étudiant</mat-label>
              <input matInput [value]="formStudentName()" disabled />
            </mat-form-field>
            <mat-form-field appearance="fill" style="width:100%">
              <mat-label>Moyenne</mat-label>
              <input matInput type="number" [value]="formMoyenne()" disabled />
            </mat-form-field>
            <mat-form-field appearance="fill" style="width:100%">
              <mat-label>Date début</mat-label>
              <input matInput type="date" [value]="formDateDebut()" disabled />
            </mat-form-field>
          </div>
          <div style="margin-top:8px; display:flex; gap:8px">
            <button mat-flat-button color="primary" (click)="confirmApply()" [disabled]="applying()">Confirmer</button>
            <button mat-stroked-button (click)="cancelApply()" [disabled]="applying()">Annuler</button>
          </div>
          <p *ngIf="success()" style="margin-top:8px">{{success()}}</p>
        </mat-card>
      </div>

  <!-- send email now uses a Material dialog (MailSendComponent) -->
    </mat-card>

    <!-- reference MailSendComponent so standalone import is recognized by the compiler -->
    <ng-container *ngIf="false">
      <app-mail-send></app-mail-send>
    </ng-container>
  `
})
export class ListeOffresComponent {
  offres = signal<OffreResponse[]>([]);
  favorisMap: WritableSignal<Record<number, number | null>> = signal({});
  selectedOffre = signal<number | null>(null);
  formStudentName = signal<string>('');
  formMoyenne = signal<number>(10);
  formDateDebut = signal<string>('');
  applying = signal(false);
  success = signal<string | null>(null);

  sendSuccess = signal<string | null>(null);

  role = signal<string | null>(null); // signal for role

  constructor(
    private svc: OffreService,
    private favSvc: FavoriteService,
    private auth: AuthService,
    private candidatureSvc: CandidatureService,
    private profileSvc: ProfileEtudiantService,
  private mailSvc: MailService,
  private dialog: MatDialog
  ) {
    this.role.set(auth.getRole());
    this.load();
  }

  get displayedColumns() {
    const cols: string[] = [];
    if (this.isCandidat()) { cols.push('fav', 'apply'); }
    cols.push('titre', 'description', 'periode', 'status');
    if (!this.isCandidat()) cols.push('email');
    return cols;
  }

  isCandidat() {
    return (this.role() || '').toLowerCase() === 'candidat';
  }

  async load() {
    const data = await this.svc.list();
    this.offres.set(data);

    const userId = this.auth.getUserId();
    if (userId && this.isCandidat()) { // only load favs for "candidat"
      const favs: any[] = await this.favSvc.listForUser(userId);
      const map: Record<number, number | null> = {};
      favs.forEach(f => {
        const offreId = f.offreId ?? f.offre?.id ?? null;
        if (offreId) map[offreId] = f.id ?? null;
      });
      this.favorisMap.set(map);
    }
  }

  isFavorite(offreId: number) {
    return !!this.favorisMap()[offreId];
  }

  async toggleFavorite(offreId: number, checked: boolean) {
    if (!this.isCandidat()) return; // safety check
    const userId = this.auth.getUserId();
    if (!userId) return;

    const currentMap = { ...this.favorisMap() };

    if (checked) {
      currentMap[offreId] = null;
      this.favorisMap.set(currentMap);
      try {
        const created: any = await this.favSvc.add({ userId, offreId });
        currentMap[offreId] = created.id ?? created.offreId ?? null;
        this.favorisMap.set({ ...currentMap });
      } catch {
        delete currentMap[offreId];
        this.favorisMap.set({ ...currentMap });
      }
    } else {
      const favId = this.favorisMap()[offreId];
      if (!favId) return;
      delete currentMap[offreId];
      this.favorisMap.set({ ...currentMap });
      try {
        await this.favSvc.delete(favId);
      } catch {
        currentMap[offreId] = favId;
        this.favorisMap.set({ ...currentMap });
      }
    }
  }

  async openApply(o: OffreResponse) {
    this.selectedOffre.set(o.id);
    this.formStudentName.set(this.auth.getFullName() ?? '');
    this.formMoyenne.set(10);
    this.formDateDebut.set(o.dateDebut?.slice(0, 10) ?? new Date().toISOString().slice(0, 10));
    this.success.set(null);

    const userId = this.auth.getUserId();
    if (userId) {
      try {
        const profile = await this.profileSvc.getByUserId(userId);
        if (profile?.moyenne != null) this.formMoyenne.set(profile.moyenne);
      } catch {}
    }
  }

  cancelApply() { this.selectedOffre.set(null); }

  async confirmApply() {
    const offreId = this.selectedOffre();
    if (!offreId) return;
    const userId = this.auth.getUserId();
    if (!userId) { alert('Veuillez vous connecter.'); return; }
    this.applying.set(true);
    try {
      await this.candidatureSvc.create({
        userId,
        studentName: this.formStudentName(),
        moyenne: this.formMoyenne(),
        dateDebutMobilite: this.formDateDebut(),
        offreId
      });
      this.success.set('Candidature créée');
      setTimeout(() => { this.selectedOffre.set(null); this.success.set(null); }, 1500);
    } catch {
      alert('Erreur lors de la création de la candidature');
    } finally {
      this.applying.set(false);
    }
  }

  openSendEmail(offreId: number) {
    this.sendSuccess.set(null);
    const ref = this.dialog.open(MailSendComponent, { width: '600px', data: { offerId: offreId } });
    ref.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sendSuccess.set('Email envoy\u00e9');
        setTimeout(() => this.sendSuccess.set(null), 1500);
      }
    });
  }
}