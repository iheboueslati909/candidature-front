import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { UserRequestDTO } from './UserRequestDTO';
import { UserResponseDTO } from './UserResponseDTO';
import { UpdatePasswordRequestDTO } from './UpdatePasswordRequestDTO';
import { UserRoleRequestDTO } from './UserRoleRequestDTO';
import { PageResponseDTO } from './PageResponseDTO';
import { LoginRequestDTO } from './LoginRequestDTO';
import { LoginResponseDTO } from './LoginResponseDTO';

const BASE_URL = 'http://localhost:8885/mobility/authentication';
const USER_URL = 'http://localhost:8885/mobility/users';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  }

 private getAuthHeaders(): HttpHeaders {
  let token: string | null = null;

  if (isPlatformBrowser(this.platformId)) {
    token = localStorage.getItem('Token');
  }

  return new HttpHeaders({
    'Authorization': token ? `Bearer ${token}` : ''
  });
}

  login(loginData: LoginRequestDTO): Observable<LoginResponseDTO> {
    return this.http.post<LoginResponseDTO>(`${BASE_URL}/login`, loginData).pipe(
      tap((response: LoginResponseDTO) => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('Token', response.jwt);
          localStorage.setItem('Username', response.username);

          localStorage.setItem('User', JSON.stringify(response));
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('Token');
      localStorage.removeItem('User');
      this.loggedIn.next(false);
    }
  }

  isLoggedIn(): boolean {
    return this.hasToken();
  }

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('Token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('Token');
    }
    return null;
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('User');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

    getPayload(): any | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const token = localStorage.getItem('Token');
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  getUserId(): string | null {
    const payload = this.getPayload();
    return payload?.id || null;
  }

  getUsername(): string | null {
    const payload = this.getPayload();
    return payload?.sub || null;
  }

    getFullName(): string | null {
    const payload = this.getPayload();
    return payload?.fullName || null;
  }

  getRoles(): string[] {
    const payload = this.getPayload();
    return payload?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.some((role) => this.getRoles().includes(role));
  }

  // User CRUD
  createUser(user: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${USER_URL}/create`, user);
  }

  updateUser(id: string, user: UserRequestDTO): Observable<UserResponseDTO> {
    return this.http.put<UserResponseDTO>(`${USER_URL}/update/${id}`, user, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${USER_URL}/delete/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Password
  updatePassword(passwordDto: UpdatePasswordRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${USER_URL}/pwd`, passwordDto, {
      headers: this.getAuthHeaders(),
    });
  }

  // Status
  updateStatus(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${USER_URL}/status/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Roles
  addRoleToUser(roleDto: UserRoleRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${USER_URL}/roles/add`, roleDto, {
      headers: this.getAuthHeaders(),
    });
  }

  removeRoleFromUser(roleDto: UserRoleRequestDTO): Observable<UserResponseDTO> {
    return this.http.post<UserResponseDTO>(`${USER_URL}/roles/remove`, roleDto, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get user by id
  getUserById(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${USER_URL}/get/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get user by username (profile)
  getUserProfile(): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${USER_URL}/profile`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Get all users (paginated)
  getAllUsers(page: number = 0, size: number = 10): Observable<PageResponseDTO<UserResponseDTO>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponseDTO<UserResponseDTO>>(`${USER_URL}/all`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }

  // Search users (paginated)
  searchUsers(query: string = '', page: number = 0, size: number = 10): Observable<PageResponseDTO<UserResponseDTO>> {
    const params = new HttpParams()
      .set('query', query)
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponseDTO<UserResponseDTO>>(`${USER_URL}/search`, {
      headers: this.getAuthHeaders(),
      params,
    });
  }
  
  getUserByUsername(username: string): Observable<UserResponseDTO> {
    const token = localStorage.getItem('Token'); // JWT token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<UserResponseDTO>(`${USER_URL}/username/${username}`, { headers });
  }
  updateUserStatus(id: string): Observable<UserResponseDTO> {
    return this.http.get<UserResponseDTO>(`${USER_URL}/status/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  

  
}
