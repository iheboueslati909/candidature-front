import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthUserService } from '../DTO/auth-user.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { filter } from 'rxjs';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // roles that can view this item
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, MatSidenavModule, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showSidenav = true;

  menuItems: MenuItem[] = [
    { label: 'Historique des candidatures', icon: 'history', route: '/candidature/history', roles: ['STUDENT'] },
    { label: 'Etablissements', icon: 'school', route: '/etablissements', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Offres', icon: 'work', route: '/offres', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Notifications', icon: 'notifications', route: '/notification/list', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Candidatures', icon: 'assignment', route: '/candidature/list', roles: ['SUPER_ADMIN'] },
  { label: 'Créer offre', icon: 'add', route: '/offres/new', roles: ['SUPER_ADMIN'] },
  { label: 'Créer établissement', icon: 'apartment', route: '/etablissements/new', roles: ['SUPER_ADMIN'] },
    { label: 'Utilisateurs', icon: 'people', route: '/user/list', roles: ['SUPER_ADMIN'] },
  ];

  constructor(private router: Router, private authUserService: AuthUserService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hiddenRoutes = ['/login', '/register'];
        this.showSidenav = !hiddenRoutes.includes(event.urlAfterRedirects);
      });
  }

  get roles(): string[] {
    return (this.authUserService.getRoles() || []).map(r => r.toUpperCase());
  }

  canView(item: MenuItem): boolean {
    // super admin sees everything
    if (this.roles.includes('SUPER_ADMIN')) return true;

    // any role match
    return item.roles.some(r => this.roles.includes(r.toUpperCase()));
  }

  isCandidat(): boolean {
    return this.roles.includes('STUDENT');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('SUPER_ADMIN');
  }
}
