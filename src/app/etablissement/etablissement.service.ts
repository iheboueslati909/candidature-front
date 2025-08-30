import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

export interface EtablissementResponse { id: number; nom: string; pays: string; averageRating?: number }

@Injectable({ providedIn: 'root' })
export class EtablissementService {
  constructor(private http: HttpClient) {}
  async list() { return await firstValueFrom(this.http.get<EtablissementResponse[]>(`${environment.apiBaseUrl}/api/etablissements`)); }
}
