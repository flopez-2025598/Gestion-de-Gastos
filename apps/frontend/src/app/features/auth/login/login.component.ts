import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="auth-shell">
      <form class="auth-card" [formGroup]="form" (ngSubmit)="submit()">
        <h1>Finova</h1>
        <h2>Iniciar sesión</h2>

        <label>
          <span>Email</span>
          <input type="email" formControlName="email" placeholder="correo@ejemplo.com" />
        </label>

        <label>
          <span>Contraseña</span>
          <input type="password" formControlName="password" placeholder="••••••••" />
        </label>

        <button type="submit" [disabled]="form.invalid || isSubmitting">
          {{ isSubmitting ? 'Ingresando...' : 'Entrar' }}
        </button>

        <p class="error" *ngIf="errorMessage">{{ errorMessage }}</p>
      </form>
    </section>
  `,
  styles: `
    :host {
      display: block;
      min-height: 100vh;
      background: #f4f7fb;
    }

    .auth-shell {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .auth-card {
      width: min(100%, 420px);
      background: white;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      padding: 32px 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
      color: #0f172a;
    }

    h2 {
      margin: 0;
      font-size: 1.2rem;
      color: #334155;
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: #334155;
      font-weight: 600;
    }

    input {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 1rem;
      outline: none;
    }

    input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    }

    button {
      border: none;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      padding: 12px 16px;
      font-weight: 700;
      cursor: pointer;
    }

    button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error {
      margin: 0;
      color: #b91c1c;
      font-size: 0.95rem;
    }
  `,
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  protected isSubmitting = false;
  protected errorMessage = '';

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Completa los campos requeridos';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    this.authService
      .login({
        email: this.form.value.email ?? '',
        password: this.form.value.password ?? '',
      })
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/dashboard');
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.error ?? 'No se pudo iniciar sesión';
        },
      });
  }
}
