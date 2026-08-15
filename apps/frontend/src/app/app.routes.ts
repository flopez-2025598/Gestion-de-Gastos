import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { adminGuard } from './core/auth/admin.guard';
import { AdminComponent } from './features/admin/admin.component';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { IncomeComponent } from './features/income/income.component';
import { ExpensesComponent } from './features/expenses/expenses.component';
import { EmergencyFundComponent } from './features/emergency-fund/emergency-fund.component';
import { ReportsComponent } from './features/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'income',
    component: IncomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'expenses',
    component: ExpensesComponent,
    canActivate: [authGuard],
  },
  { path: 'emergency-fund', component: EmergencyFundComponent, canActivate: [authGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [authGuard, adminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
