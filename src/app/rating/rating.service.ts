import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface RatingRequest { userId: string; etablissementId: number; score: number }

@Injectable({ providedIn: 'root' })
export class RatingService {
  constructor(private http: HttpClient) {}
  async submit(r: RatingRequest) {
  try { return await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/api/ratings`, r)); }
    catch { return { ok: true }; }
  }
}
