import { Routes } from '@angular/router';
import { ProfileComponent } from './authentication/profile/profile.component';
import { RegisterComponent } from './authentication/register/register.component';
import { AuthenticateComponent } from './authentication/authenticate/authenticate.component';
import { DashboardComponent } from './note/dashboard/dashboard.component';
import { authGuard } from './core/auth.guard';
import { CreateComponent } from './note/create/create.component';
import { DetailComponent } from './note/detail/detail.component';

export const routes: Routes = [
  {
    path: 'users',
    redirectTo: '/profile',
  },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: AuthenticateComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'notes/create', component: CreateComponent, canActivate: [authGuard] },
  {
    path: 'notes/detail/:id',
    component: DetailComponent,
    canActivate: [authGuard],
  },
];
