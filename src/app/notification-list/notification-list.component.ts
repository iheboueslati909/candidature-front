import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h3>Notifications</h3>
  <button (click)="req()">Activer notifications</button>
  <ul>
    <li *ngFor="let n of notifs">
      {{n.createdAt | date:'short'}} — {{n.message}}
    </li>
  </ul>
  `
})
export class NotificationListComponent {
  notifs: any[] = [];
  constructor(private svc: NotificationService) { this.notifs = svc.list(); }
  req() { this.svc.requestPermission(); }
}
