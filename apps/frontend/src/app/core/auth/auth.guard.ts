import { inject } from '@angular/core';
import type { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  if (!authService.isAuthenticated()) {
    authService.logout('Tu sesión ha expirado. Inicia sesión de nuevo para continuar.');
    return false;
  }

  return true;
};
