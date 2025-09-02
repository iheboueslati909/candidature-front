import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
private _notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this._notifications.asObservable();

  constructor(private zone: NgZone) {}

  connect(userId: string) {
    const eventSource = new EventSource(`http://localhost:8080/api/notifications/stream/${userId}`);

    eventSource.addEventListener('notification', (event: MessageEvent) => {
      this.zone.run(() => {
        console.log("Received notification event:", event.data);
        const current = this._notifications.value;
        this._notifications.next([{ message: event.data, createdAt: new Date() }, ...current]);
      });
    });

    eventSource.onerror = (error) => {
      console.error("Notification SSE error", error);
      eventSource.close();
    };
  }
  list(): any[] {
    return this._notifications.value;
  }

  hasUnread(): boolean {
    return this._notifications.value.length > 0;
  }
}
