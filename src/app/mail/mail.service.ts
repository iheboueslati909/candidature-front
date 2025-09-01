import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';
import { AuthUserService } from '../DTO/auth-user.service';

export interface MailPayload { offerId: number; }

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(private http: HttpClient, private authUserService: AuthUserService) {}

  async send(payload: MailPayload) {
    console.log(payload, "sending email payload");

    // Get token from your auth service
    const token = this.authUserService.getToken();

    // Attach Authorization header
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      return await firstValueFrom(
        this.http.post(`${environment.apiBaseUrl}/api/mails/appel`, payload, { headers })
      );
    } catch (err) {
      console.error("Mail send failed", err);
      return { ok: false, error: err };
    }
  }
}
