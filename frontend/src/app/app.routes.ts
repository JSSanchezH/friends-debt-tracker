import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DebtListComponent } from './features/debt/debt-list/debt-list.component';
import { DebtDetailComponent } from './features/debt/debt-detail/debt-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'debts',
    children: [
      { path: '', component: DebtListComponent }, // /debts
      { path: ':id', component: DebtDetailComponent }, // /debts/:id
    ],
  },
  { path: '**', redirectTo: '/login' },
];
