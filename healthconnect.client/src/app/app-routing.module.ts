import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './log-in/log-in.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { NurseDashboardComponent } from './nurse-dashboard/nurse-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AnalyticsDashboardComponent } from './analytics-dashboard/analytics-dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  // Public routes (no authentication required)
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'terms-conditions', component: TermsConditionsComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },

  // Protected routes (authentication required)
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Student'] }
  },
  {
    path: 'nurse-dashboard',
    component: NurseDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Nurse'] }
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },
  {
    path: 'admin-dashboard/reports/appointment-statistics',
    component: AnalyticsDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['Admin'] }
  },

  // Catch-all route
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
