import { Injectable } from '@angular/core';
import { CandidatureService } from '../candidature/candidature.service';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notifications: any[] = [];
  constructor(private cand: CandidatureService) {
    this.cand.onNew(c => this.handleNew(c));
  }
  list() { return this.notifications.slice().reverse(); }
  private handleNew(c: any) {
    const msg = `Nouvelle candidature: ${c.studentName} pour ${c.etablissementName || 'offre'}`;
    this.notifications.push({ createdAt: new Date().toISOString(), message: msg, candidature: c });
    if ("Notification" in window && Notification.permission === 'granted') {
      new Notification('Nouvelle candidature', { body: msg });
    }
  }
  async requestPermission() { if ("Notification" in window) await Notification.requestPermission(); }
}
