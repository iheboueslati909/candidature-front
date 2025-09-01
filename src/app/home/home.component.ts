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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificationListComponent } from '../notification-list/notification-list.component';
import { filter } from 'rxjs';
import { NotificationService } from '../notification-list/notification.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[]; // roles that can view this item
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  MatDividerModule,
  MatDialogModule,
  NotificationListComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  showSidenav = true;
  hasNotifications = false;

  menuItems: MenuItem[] = [
    { label: 'Historique des candidatures', icon: 'history', route: '/candidature/history', roles: ['STUDENT'] },
    { label: 'Etablissements', icon: 'school', route: '/etablissements', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Offres', icon: 'work', route: '/offres', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Notifications', icon: 'notifications', route: '/notification/list', roles: ['STUDENT', 'SUPER_ADMIN'] },
    { label: 'Candidatures', icon: 'assignment', route: '/candidature/list', roles: ['SUPER_ADMIN'] },
    { label: 'Créer offre', icon: 'add', route: '/offres/new', roles: ['SUPER_ADMIN'] },
    { label: 'Créer établissement', icon: 'apartment', route: '/etablissements/new', roles: ['SUPER_ADMIN'] },
  ];

  constructor(
    private router: Router,
    private authUserService: AuthUserService,
  private notificationService: NotificationService,
  private dialog: MatDialog
  ) {
    // Show/Hide sidenav based on route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const hiddenRoutes = ['/login', '/register'];
        this.showSidenav = !hiddenRoutes.includes(event.urlAfterRedirects);
      });

    // Connect to SSE for notifications
    const userId = this.authUserService.getUserId();
    if (userId) {
      this.notificationService.connect(userId);

      // Update badge/dot when new notifications arrive
      this.notificationService.notifications$.subscribe(notifs => {
        this.hasNotifications = notifs.length > 0;
      });
    }
  }

  openNotifications() {
    const ref = this.dialog.open(NotificationListComponent, { width: '480px' });
    ref.afterClosed().subscribe(() => {
      // clear the notification indicator when the dialog is closed
      this.hasNotifications = false;
    });
  }

  get roles(): string[] {
    return (this.authUserService.getRoles() || []).map(r => r.toUpperCase());
  }

  canView(item: MenuItem): boolean {
    if (this.roles.includes('SUPER_ADMIN')) return true; // Super admin sees everything
    return item.roles.some(r => this.roles.includes(r.toUpperCase()));
  }

  isCandidat(): boolean {
    return this.roles.includes('STUDENT');
  }

  isSuperAdmin(): boolean {
    return this.roles.includes('SUPER_ADMIN');
  }
}
