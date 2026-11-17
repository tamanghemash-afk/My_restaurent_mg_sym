import { inject } from '@angular/core';
import { CanActivateFn, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.model';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const noAuthGuard: CanActivateFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!auth.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/tables']);
};

export const roleGuard = (...allowedRoles: UserRole[]): CanActivateFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const userRole = auth.role();
    if (!auth.isAuthenticated() || !userRole || !allowedRoles.includes(userRole)) {
      return router.createUrlTree(['/tables']);
    }
    return true;
  };
};
