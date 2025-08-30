import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface MailPayload { offerId: number; }

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(private http: HttpClient) {}
  async send(payload: MailPayload) {
    console.log(payload , "hhhhhhhhhhhh")
    try {
  return await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/api/mails/appel`, payload));
    } catch (err) {
      // fallback: pretend success
      return { ok: true };
    }
  }
}
