import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface EtablissementResponse { id: number; nom: string; pays: string; averageRating?: number }

@Injectable({ providedIn: 'root' })
export class EtablissementService {
  constructor(private http: HttpClient) {}
  async list() { return await firstValueFrom(this.http.get<EtablissementResponse[]>(`${environment.apiBaseUrl}/api/etablissements`)); }
  async create(payload: { nom: string; pays: string }) {
    return await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/api/etablissements`, payload));
  }
}
