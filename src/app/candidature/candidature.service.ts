import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { CandidatureRequest, CandidatureResponse } from './candidature.model';
import { environment } from '../../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  constructor(private http: HttpClient) {}

  async create(req: CandidatureRequest): Promise<CandidatureResponse> {
    // Try backend first
    try {
  const res = await firstValueFrom(this.http.post<CandidatureResponse>(`${environment.apiBaseUrl}/api/candidatures`, req));
  this.notifyNewCandidature(res);
      return res;
    } catch (err) {
  throw err;
    }
  }

  async update(id: number, patch: Partial<CandidatureResponse>): Promise<CandidatureResponse> {
  const res = await firstValueFrom(this.http.put<CandidatureResponse>(`${environment.apiBaseUrl}/api/candidatures/${id}`, patch));
  return res;
  }

  async updateStatus(id: number, status: 'PENDING'|'ACCEPTED'|'REFUSED'|'WAITING_LIST'): Promise<CandidatureResponse> {
    const url = `${environment.apiBaseUrl}/api/candidatures/${id}/status?status=${encodeURIComponent(status)}`;
    const res = await firstValueFrom(this.http.put<CandidatureResponse>(url, null));
    return res;
  }

  async delete(id: number): Promise<void> {
  await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/api/candidatures/${id}`));
  }

  async listAll(): Promise<CandidatureResponse[]> {
  const res = await firstValueFrom(this.http.get<CandidatureResponse[]>(`${environment.apiBaseUrl}/api/candidatures`));
  return res;
  }

  async listByUser(userId: string) {
  const res = await firstValueFrom(this.http.get<CandidatureResponse[]>(`${environment.apiBaseUrl}/api/candidatures/user/${userId}`));
  return res;
  }

  async filterByStatus(status?: string) {
  if (!status) return this.listAll();
  const all = await this.listAll();
  return all.filter(c => c.status === status);
  }

  async sortByMoyenne(_desc = true) {
    // The backend returns the list already sorted by "moyenne".
    // Consume the endpoint and update local cache. On failure, return the current list without client-side sorting.
  const res = await firstValueFrom(this.http.get<CandidatureResponse[]>(`${environment.apiBaseUrl}/api/candidatures/sorted/moyenne`));
  return res;
  }

  // Very small pub/sub for notifications
  private notificationHandlers: Array<(c: CandidatureResponse) => void> = [];
  onNew(handler: (c: CandidatureResponse) => void) { this.notificationHandlers.push(handler); }
  offNew(handler: (c: CandidatureResponse) => void) { this.notificationHandlers = this.notificationHandlers.filter(h => h !== handler); }
  private notifyNewCandidature(c: CandidatureResponse) { this.notificationHandlers.forEach(h => h(c)); }
}
