import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CandidatureListComponent } from './candidature/candidature-list/candidature-list.component';
import { CandidatureHistoryComponent } from './candidature/candidature-history/candidature-history.component';
import { MailSendComponent } from './mail/mail-send/mail-send.component';
import { CandidatureFormComponent } from './candidature/candidature-form.component';
// import { NotificationListComponent } from './notification-list/notification-list.component';
import { RatingFormComponent } from './rating/rating-form/rating-form.component';
import { FavoriteListComponent } from './favorite/favorite-list/favorite-list.component';
import { ListeEtablissementsComponent } from './etablissement/liste-etablissements.component';
import { CreateEtablissementComponent } from './etablissement/create-etablissement.component';
import { ListeOffresComponent } from './offre/liste-offres.component';
import { CreateOffreComponent } from './offre/create-offre.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  // redirect the empty path to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

   {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'candidature/list', component: CandidatureListComponent },
      { path: 'candidature/new', component: CandidatureFormComponent },
      { path: 'candidature/history', component: CandidatureHistoryComponent },
      { path: 'mail/send', component: MailSendComponent },
      { path: 'user/list', component: UserListComponent },
      { path: 'user/details/:id', component: UserDetailsComponent },
      { path: 'rating/form', component: RatingFormComponent },
      { path: 'favorite/list', component: FavoriteListComponent },
      { path: 'etablissements', component: ListeEtablissementsComponent },
      { path: 'offres/new', component: CreateOffreComponent },
      { path: 'etablissements/new', component: CreateEtablissementComponent },
      { path: 'offres', component: ListeOffresComponent },
    ]
  },

  { path: 'login', component: LoginComponent }, 
  { path: 'register', component: RegisterComponent },
];
