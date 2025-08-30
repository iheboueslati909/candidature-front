import { Component, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OffreService, OffreResponse } from './offre.service';
import { CandidatureService } from '../candidature/candidature.service';
import { ProfileEtudiantService } from '../profile/profile-etudiant.service';
import { FavoriteService } from '../favorite/favorite.service';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';

@Component({
  selector: 'app-liste-offres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3>Liste des offres</h3>
    <div class="table-container" style="position:relative">
      <table style="width:100%">
        <thead>
          <tr>
            <th *ngIf="isCandidat()">Fav</th>
            <th *ngIf="isCandidat()">Postuler</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Période</th>
            <th>Status</th>
            <th *ngIf="!isCandidat()">Email appel d'offre</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let o of offres()">
            <td *ngIf="isCandidat()">
              <input type="checkbox" [checked]="isFavorite(o.id)" (change)="toggleFavorite(o.id, $event.target.checked)" />
            </td>
            <td *ngIf="isCandidat()">
              <button (click)="openApply(o)">Postuler</button>
            </td>

            <td>{{ o.titre }}</td>
            <td>{{ o.description }}</td>
            <td>{{ o.dateDebut | date }} — {{ o.dateFin | date }}</td>
            <td>{{ o.active ? 'active' : 'inactive' }}</td>
                        <td *ngIf="!isCandidat()">
              <button (click)="openSendEmail(o.id)">Envoyer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Apply popup -->
      <div *ngIf="selectedOffre() !== null" style="position:absolute; left:0; right:0; top:100%; margin-top:8px; background:#fff; border:1px solid #ccc; padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.12); z-index:50">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>Postuler à l'offre</strong>
          <button (click)="cancelApply()" style="background:none;border:none;font-size:18px;">✕</button>
        </div>
        <div style="margin-top:8px">
          <label style="display:block; margin-bottom:6px">Nom étudiant:
            <input style="width:100%" [value]="formStudentName()" disabled />
          </label>
          <label style="display:block; margin-bottom:6px">Moyenne:
            <input type="number" style="width:100%" [value]="formMoyenne()" disabled />
          </label>
          <label style="display:block; margin-bottom:6px">Date début:
            <input type="date" style="width:100%" [value]="formDateDebut()" disabled />
          </label>
        </div>
        <div style="margin-top:8px; display:flex; gap:8px">
          <button (click)="confirmApply()" [disabled]="applying()">Confirmer</button>
          <button (click)="cancelApply()" [disabled]="applying()">Annuler</button>
        </div>
        <p *ngIf="success()" style="margin-top:8px">{{success()}}</p>
      </div>

      <!-- Send email popup -->
      <div *ngIf="selectedSendOffre() !== null" style="position:absolute; left:0; right:0; top:calc(100% + 8px); background:#fff; border:1px solid #ccc; padding:12px; box-shadow:0 6px 18px rgba(0,0,0,0.12); z-index:60">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>Confirmer l'envoi d'email</strong>
          <button (click)="cancelSendEmail()" style="background:none;border:none;font-size:18px;">✕</button>
        </div>
        <p style="margin-top:8px">Voulez-vous envoyer un email pour l'offre id {{selectedSendOffre()}} ?</p>
        <div style="margin-top:8px; display:flex; gap:8px">
          <button (click)="confirmSendEmail()" [disabled]="sendLoading()">Confirmer</button>
          <button (click)="cancelSendEmail()" [disabled]="sendLoading()">Annuler</button>
        </div>
        <p *ngIf="sendSuccess()" style="margin-top:8px">{{sendSuccess()}}</p>
      </div>
    </div>
  `
})
export class ListeOffresComponent {
  offres = signal<OffreResponse[]>([]);
  favorisMap: WritableSignal<Record<number, number | null>> = signal({});
  selectedOffre = signal<number | null>(null);
  selectedSendOffre = signal<number | null>(null);

  formStudentName = signal<string>('');
  formMoyenne = signal<number>(10);
  formDateDebut = signal<string>('');
  applying = signal(false);
  success = signal<string | null>(null);

  sendLoading = signal(false);
  sendSuccess = signal<string | null>(null);

  role = signal<string | null>(null); // signal for role

  constructor(
    private svc: OffreService,
    private favSvc: FavoriteService,
    private auth: AuthService,
    private candidatureSvc: CandidatureService,
    private profileSvc: ProfileEtudiantService,
    private mailSvc: MailService
  ) {
    this.role.set(auth.getRole());
    this.load();
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

  openSendEmail(offreId: number) { this.selectedSendOffre.set(offreId); this.sendSuccess.set(null); }
  cancelSendEmail() { this.selectedSendOffre.set(null); this.sendLoading.set(false); }

  async confirmSendEmail() {
    const offreId = this.selectedSendOffre();
    if (!offreId) return;
    this.sendLoading.set(true);
    try {
      await this.mailSvc.send({ offerId: offreId });
      this.sendSuccess.set('Email envoyé');
      setTimeout(() => { this.selectedSendOffre.set(null); this.sendSuccess.set(null); }, 1500);
    } catch {
      this.sendSuccess.set('Erreur lors de l\'envoi');
    } finally {
      this.sendLoading.set(false);
    }
  }
}
