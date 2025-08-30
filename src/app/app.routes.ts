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
import { ListeOffresComponent } from './offre/liste-offres.component';
import { CreateOffreComponent } from './offre/create-offre.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: 'candidature/list', component: CandidatureListComponent },
      { path: 'candidature/new', component: CandidatureFormComponent },
      { path: 'candidature/history', component: CandidatureHistoryComponent },
      { path: 'mail/send', component: MailSendComponent },
      // { path: 'notification/list', component: NotificationListComponent },
      { path: 'rating/form', component: RatingFormComponent },
      { path: 'favorite/list', component: FavoriteListComponent },
  { path: 'etablissements', component: ListeEtablissementsComponent },
  { path: 'offres/new', component: CreateOffreComponent },
  { path: 'offres', component: ListeOffresComponent },
      { path: '', redirectTo: 'candidature/list', pathMatch: 'full' }
    ]
  }
];
