import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface ProfileEtudiantResponse { id: number; userId: number; moyenne?: number }

@Injectable({ providedIn: 'root' })
export class ProfileEtudiantService {
  constructor(private http: HttpClient) {}
  async getByUserId(userId: number) {
    return await firstValueFrom(this.http.get<ProfileEtudiantResponse>(`${environment.apiBaseUrl}/api/profiles/user/${userId}`));
  }
}
