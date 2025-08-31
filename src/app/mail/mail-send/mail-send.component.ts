import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-send',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h3 mat-dialog-title>Confirmer l'envoi</h3>
    <div mat-dialog-content>
      <p *ngIf="data?.offerId !== undefined">
        Voulez-vous envoyer un email pour l'offre id {{ data.offerId }} ?
      </p>
      <p *ngIf="data?.etablissement !== undefined">
        Voulez-vous envoyer un email pour l'établissement {{ data.etablissement.nom }} ?
      </p>
    </div>
    <div mat-dialog-actions style="justify-content:flex-end">
      <button mat-stroked-button (click)="close(false)" [disabled]="loading">
        Annuler
      </button>
      <button mat-flat-button color="primary" (click)="confirm()" [disabled]="loading">
        {{ loading ? 'Envoi…' : 'Confirmer' }}
      </button>
    </div>
  `
})
export class MailSendComponent {
  loading = false;

  constructor(
    private mail: MailService,
    private dialogRef: MatDialogRef<MailSendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  async confirm() {
    this.loading = true;
    try {
      if (this.data?.offerId !== undefined) {
        await this.mail.send({ offerId: this.data.offerId });
      } else if (this.data?.etablissement?.id !== undefined) {
        await this.mail.send({ etablissementId: this.data.etablissement.id } as any);
      } else {
        await this.mail.send({} as any);
      }
      this.dialogRef.close(true);
    } catch (err) {
      this.dialogRef.close(false);
    } finally {
      this.loading = false;
    }
  }

  close(value: boolean) {
    this.dialogRef.close(value);
  }
}
