import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface JwtPayload {
  sub?: string;
  role?: string;
  userId?: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'token';
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private token$ = new BehaviorSubject<string | null>(this.getRawToken());

  /** Current token */
  get token() {
    return this.token$.value;
  }

  /** Observable for changes (login/logout) */
  tokenChanges() {
    return this.token$.asObservable();
  }

  /** Get token from storage (safe in SSR) */
  private getRawToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.tokenKey);
  }

  /** Save/remove token (safe in SSR) */
  setToken(t: string | null) {
    if (this.isBrowser) {
      if (t) localStorage.setItem(this.tokenKey, t);
      else localStorage.removeItem(this.tokenKey);
    }
    this.token$.next(t);
  }

  /** Decode JWT payload */
  private decodePayload(): JwtPayload | null {
    const t = this.token;
    if (!t) return null;

    const parts = t.split('.');
    if (parts.length < 2) return null;

    try {
      const payload = parts[1];
      // Base64Url → Base64
      const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  /** Extract userId (custom claim or fallback to sub) */
  getUserId(): string | null {
    const p = this.decodePayload();
    if (!p) return null;

    return p.userId ?? null;
  }

  /** Extract role (custom claim) */
  getRole(): string | null {
    const p = this.decodePayload();
    return p?.role ?? null;
  }
  getRoles(): [string] | null {
    const p = this.decodePayload();
    if (!p) return null;
    return p['roles'] ?? null;
  }

  /** Try to synthesize a full name from common JWT claims */
  getFullName(): string | null {
    const p = this.decodePayload();
    return p ? p['fullName'] ?? null : null;
  }

  /** Token expiry check */
//   isTokenExpired(): boolean {
//     const p = this.decodePayload();
//     if (!p?.exp) return true;
//     const now = Math.floor(Date.now() / 1000);
//     return p.exp < now;
//   }

  /** Logout */
  logout() {
    this.setToken(null);
  }
}
