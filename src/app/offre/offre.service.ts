import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface OffreResponse { id: number; titre: string; description?: string; dateDebut?: string; dateFin?: string; active?: boolean; etablissementId?: number }

@Injectable({ providedIn: 'root' })
export class OffreService {
  constructor(private http: HttpClient) {}
  async list() { return await firstValueFrom(this.http.get<OffreResponse[]>(`${environment.apiBaseUrl}/api/offres`)); }
  async create(req: { titre: string; description?: string; dateDebut: string; dateFin: string; etablissementId: number; createdBy: string }) {
    var res = await firstValueFrom(this.http.post<OffreResponse>(`${environment.apiBaseUrl}/api/offres`, req));
    console.log("OffreService.create res=", res);
    return res;
  }
}
