import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OffreService, OffreResponse } from './offre.service';
import { CandidatureService } from '../candidature/candidature.service';
import { ProfileEtudiantService } from '../profile/profile-etudiant.service';
import { FavoriteService } from '../favorite/favorite.service';
import { MailService } from '../mail/mail.service';
import { MailSendComponent } from '../mail/mail-send/mail-send.component';
import { ApplyDialogComponent } from './apply-dialog.component';
import { AuthUserService } from '../DTO/auth-user.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-liste-offres',
  standalone: true,
  styleUrls: ['./liste-offres.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,   // kept only because you still use dialogs
    MailSendComponent,
    ApplyDialogComponent
  ],
  template: `
    <div class="offer-list-container">
      <h2 class="list-title">
        Liste des offres <span><i class="ri-briefcase-line"></i></span>
      </h2>

      <div class="table-card shadow-lg">
        <div class="table-responsive">
          <table class="offer-table">
            <thead>
              <tr>
                <th *ngIf="isCandidat()" class="header-cell text-center">Fav</th>
                <th *ngIf="isCandidat()" class="header-cell text-center">Postuler</th>
                <th class="header-cell">Titre</th>
                <th class="header-cell">Description</th>
                <th class="header-cell">Période</th>
                <th class="header-cell text-center">Status</th>
                <th *ngIf="!isCandidat()" class="header-cell text-center">Email</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of offres()" class="data-row">
                <!-- Favorite toggle -->
                  <td *ngIf="isCandidat()" class="data-cell text-center">
                    <button class="action-button tooltip-container"
                            (click)="toggleFavorite(o.id, !isFavorite(o.id))">
                      <i [ngClass]="{
                            'ri-heart-3-fill text-red-600': isFavorite(o.id),
                            'ri-heart-3-line text-gray-300': !isFavorite(o.id)
                          }"
                        class="action-icon"
                        style="transition: color 0.2s;">
                      </i>
                      <span class="tooltip-text">
                        {{ isFavorite(o.id) ? 'Retirer des favoris' : 'Ajouter aux favoris' }}
                      </span>
                    </button>
                    </td>
                <!-- Apply button -->
                <td *ngIf="isCandidat()" class="data-cell text-center">
                  <button class="btn btn-primary-2" (click)="openApply(o)">
                    <i class="ri-send-plane-line"></i> Postuler
                  </button>
                </td>

                <!-- Basic info -->
                <td class="data-cell">{{ o.titre }}</td>
                <td class="data-cell">{{ o.description }}</td>
                <td class="data-cell">{{ o.dateDebut | date }} — {{ o.dateFin | date }}</td>

                <!-- Status -->
                <td class="data-cell text-center">
                  <i class="status-icon"
                     [ngClass]="{
                       'ri-check-line status-active': o.active,
                       'ri-close-line status-inactive': !o.active
                     }">
                  </i>
                </td>

                <!-- Email action (non-candidat only) -->
                <td *ngIf="!isCandidat()" class="data-cell text-center">
                  <button class="action-button tooltip-container" (click)="openSendEmail(o.id)">
                    <i class="ri-mail-send-line action-icon"></i>
                    <span class="tooltip-text">Envoyer</span>
                  </button>
                </td>
              </tr>

              <!-- Empty state -->
              <tr *ngIf="!offres() || offres().length === 0">
                <td class="no-data-row" [attr.colspan]="isCandidat() ? 7 : 5">
                  Aucune offre trouvée.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Success messages -->
      <div *ngIf="success()" class="success-message">
        <i class="ri-check-double-line"></i> {{ success() }}
      </div>
      <div *ngIf="sendSuccess()" class="success-message">
        <i class="ri-mail-check-line"></i> {{ sendSuccess() }}
      </div>
    </div>
  `
})
export class ListeOffresComponent {
  offres = signal<OffreResponse[]>([]);
  favorisMap: WritableSignal<Record<number, number | null>> = signal({});
  applying = signal(false);
  success = signal<string | null>(null);
  sendSuccess = signal<string | null>(null);

  constructor(
    private svc: OffreService,
    private favSvc: FavoriteService,
    private candidatureSvc: CandidatureService,
    private profileSvc: ProfileEtudiantService,
    private authUserService: AuthUserService,
    private mailSvc: MailService,
    private dialog: MatDialog
  ) {
    this.load();
  }

  get roles(): string[] {
    return (this.authUserService.getRoles() || []).map(r => r.toUpperCase());
  }

  isCandidat(): boolean {
    return this.roles.includes('STUDENT');
  }

  async load() {
    const data = await this.svc.list();
    this.offres.set(data);

    const userId = this.authUserService.getUserId();
    if (userId && this.isCandidat()) {
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
    if (!this.isCandidat()) return;
    const userId = this.authUserService.getUserId();
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
    this.success.set(null);
    const ref = this.dialog.open(ApplyDialogComponent, { width: '600px', data: { offer: o } });
    ref.afterClosed().subscribe((result) => {
      if (result === true) {
        this.success.set('Candidature créée');
        setTimeout(() => this.success.set(null), 1500);
      }
    });
  }

  openSendEmail(offreId: number) {
    this.sendSuccess.set(null);
    const ref = this.dialog.open(MailSendComponent, { width: '600px', data: { offerId: offreId } });
    ref.afterClosed().subscribe((result) => {
      if (result === true) {
        this.sendSuccess.set('Email envoyé');
        setTimeout(() => this.sendSuccess.set(null), 1500);
      }
    });
  }
}
