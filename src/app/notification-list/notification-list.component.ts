import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  template: `
 <h3>Notifications</h3>
    <ul>
      <li *ngFor="let n of notifs">
        {{n.createdAt | date:'short'}} — {{n.message}}
      </li>
    </ul>
  `
})
export class NotificationListComponent implements OnInit {

  notifs: any[] = [];
constructor(private svc: NotificationService) {}

  ngOnInit() {
    this.svc.notifications$.subscribe(n => this.notifs = n);
  }
}
