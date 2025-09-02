import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageResponse } from '../DTO/pageresponse-users';
import { RoleResponseDTO } from '../DTO/RoleResponseDTO';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:8885/mobility/roles';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getRoles(page: number, size: number): Observable<PageResponse<RoleResponseDTO>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<PageResponse<RoleResponseDTO>>(`${this.apiUrl}/all`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }
}
