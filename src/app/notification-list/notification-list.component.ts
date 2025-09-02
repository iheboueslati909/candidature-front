import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from './notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  template: `
    <div class="popup-wrapper">
      <div class="popup-header">
        <span class="popup-title">Notifications</span>
        <button mat-icon-button (click)="close()" aria-label="Close">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="popup-content" *ngIf="notifs.length > 0; else noNotifs">
        <div class="notif-item" *ngFor="let n of notifs">
          <div class="notif-time">{{ n.createdAt | date:'short' }}</div>
          <div class="notif-message">{{ n.message }}</div>
        </div>
      </div>

      <ng-template #noNotifs>
        <div class="no-notifs">Aucune notification</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .popup-wrapper {
      width: 400px;
      max-height: 70vh;
      display: flex;
      flex-direction: column;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      overflow: hidden;
    }

    .popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-bottom: 1px solid #eee;
      background: #f7f7f7;
    }

    .popup-title {
      font-size: 16px;
      font-weight: 600;
    }

    .popup-content {
      padding: 12px 16px;
      overflow-y: auto;
      flex: 1;
    }

    .notif-item {
      padding: 10px;
      margin-bottom: 8px;
      border-radius: 8px;
      background: #fafafa;
      border: 1px solid #eee;
    }

    .notif-time {
      font-size: 12px;
      color: #888;
      margin-bottom: 4px;
    }

    .notif-message {
      font-size: 14px;
    }

    .no-notifs {
      text-align: center;
      padding: 20px;
      color: #777;
    }
  `]
})
export class NotificationListComponent implements OnInit {
  notifs: any[] = [];

  constructor(
    private svc: NotificationService,
    private dialogRef: MatDialogRef<NotificationListComponent>
  ) {}

  ngOnInit() {
    this.svc.notifications$.subscribe(n => this.notifs = n);
  }

  close() {
    this.dialogRef.close();
  }
}
