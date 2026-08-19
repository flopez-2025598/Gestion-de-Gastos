import { inject } from '@angular/core';
import { HttpErrorResponse, type HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthRoute = req.url.includes('/auth/login') || req.url.includes('/auth/register');

  if (isAuthRoute || req.headers.has('Authorization')) {
    return next(req);
  }

  if (!authService.isAuthenticated()) {
    authService.logout('Tu sesión ha expirado. Inicia sesión de nuevo para continuar.');
    return next(req);
  }

  const token = authService.getToken();

  const cloned = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(cloned).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        authService.logout('Tu sesión terminó por seguridad. Inicia sesión de nuevo para continuar.');
      }

      return throwError(() => error);
    }),
  );
};
