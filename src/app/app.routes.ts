import { Routes } from '@angular/router';
import { authGuard, noAuthGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [noAuthGuard],
  },
  {
    path: 'staff',
    loadComponent: () =>
      import('./features/staff/pages/staff-dashboard/staff-dashboard.component').then(m => m.StaffDashboardComponent),
    canActivate: [authGuard, roleGuard('Staff')],
  },
  {
    path: 'customer',
    loadComponent: () =>
      import('./features/customer/pages/customer-dashboard/customer-dashboard.component').then(m => m.CustomerDashboardComponent),
    canActivate: [authGuard, roleGuard('Customer')],
  },
  {
    path: 'tables',
    loadComponent: () =>
      import('./features/tables/pages/table-grid/table-grid.component').then(m => m.TableGridComponent),
    canActivate: [authGuard],
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./features/menu/pages/menu-management/menu-management.component').then(m => m.MenuManagementComponent),
    canActivate: [authGuard],
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./features/orders/pages/order-taking/order-taking.component').then(m => m.OrderTakingComponent),
    canActivate: [authGuard],
  },
  {
    path: 'billing',
    loadComponent: () =>
      import('./features/billing/pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, roleGuard('Admin')],
  },
  { path: '', redirectTo: 'tables', pathMatch: 'full' },
  { path: '**', redirectTo: 'tables' },
];
