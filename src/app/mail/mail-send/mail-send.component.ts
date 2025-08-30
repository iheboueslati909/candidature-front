import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailService } from '../mail.service';

@Component({
  selector: 'app-mail-send',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <h3>Envoyer un mail pour lancer l'appel</h3>
  <form (submit)="send($event)">
    <label>To: <input [(ngModel)]="to" name="to"></label><br />
    <label>Subject: <input [(ngModel)]="subject" name="subject"></label><br />
    <label>Body:<br /><textarea [(ngModel)]="body" name="body" rows="6"></textarea></label><br />
    <button type="submit">Envoyer</button>
  </form>
  <p *ngIf="sent">Mail envoyé (mock/backed) à {{to}}</p>
  `
})
export class MailSendComponent {
  to = '';
  subject = '';
  body = '';
  sent = false;

  constructor(private mail: MailService) {}

  async send(e: Event) {
    // e.preventDefault();
    // await this.mail.send({ to: this.to, subject: this.subject, body: this.body });
    // this.sent = true;
    // setTimeout(() => this.sent = false, 3000);
    // this.to = '';
    // this.subject = '';
    // this.body = '';
  }
}
