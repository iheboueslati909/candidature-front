import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environment';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  constructor(private http: HttpClient) {}

  async add(fav: any) {
  return await firstValueFrom(this.http.post(`${environment.apiBaseUrl}/api/favoris`, fav));
  }

  async listForUser(userId: number) {
  return await firstValueFrom(this.http.get<any[]>(`${environment.apiBaseUrl}/api/favoris/user/${userId}`));
  }
  async delete(favId: number) {
    return await firstValueFrom(this.http.delete(`${environment.apiBaseUrl}/api/favoris/${favId}`));
  }

}
