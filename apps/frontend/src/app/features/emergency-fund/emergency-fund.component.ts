import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { formatDateSpanish, formatGuatemalanCurrency } from '../../core/dashboard/dashboard.utils';
import { EmergencyFund, EmergencyFundService, FundMovement } from '../../core/emergency-fund/emergency-fund.service';

@Component({
  selector: 'app-emergency-fund', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `<main class="page"><a class="back-link" routerLink="/dashboard">← Volver al dashboard</a><h1>Fondo de emergencia</h1><section *ngIf="loading">Cargando fondo...</section><section *ngIf="error" class="error">{{error}}</section><section *ngIf="fund && !loading"><div class="balance"><p>Saldo actual</p><strong>{{money(fund.balance)}}</strong></div><div class="forms"><form [formGroup]="depositForm" (ngSubmit)="move('deposit')"><h2>Depositar</h2><input type="number" min="0.01" step="0.01" formControlName="amount" placeholder="Monto"/><input formControlName="description" placeholder="Descripción opcional"/><button>Depositar</button></form><form [formGroup]="withdrawForm" (ngSubmit)="move('withdraw')"><h2>Retirar</h2><input type="number" min="0.01" step="0.01" formControlName="amount" placeholder="Monto"/><input formControlName="description" placeholder="Descripción opcional"/><button>Retirar</button></form></div><p *ngIf="message" [class.error]="!!error">{{message}}</p><h2>Historial</h2><p *ngIf="!movements.length">No hay movimientos registrados.</p><table *ngIf="movements.length"><tr><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Descripción</th></tr><tr *ngFor="let m of movements"><td>{{m.type==='DEPOSIT'?'Depósito':'Retiro'}}</td><td>{{money(m.amount)}}</td><td>{{date(m.date)}}</td><td>{{m.description||'—'}}</td></tr></table></section></main>`,
  styles: [`.page{max-width:1000px;margin:auto;padding:32px;font-family:Arial;color:#0f172a}.back-link{display:inline-block;margin-bottom:18px;color:#4f46a5;font-weight:600;text-decoration:none}.back-link:hover{text-decoration:underline}.balance,.forms form{background:#fff;padding:24px;border-radius:14px;box-shadow:0 3px 12px #0001}.balance strong{font-size:2rem}.forms{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin:24px 0}.forms form{display:grid;gap:10px}input{padding:10px;border:1px solid #cbd5e1;border-radius:8px}button{padding:10px;background:#2563eb;color:#fff;border:0;border-radius:8px;font-weight:bold}.error{color:#b91c1c}table{width:100%;border-collapse:collapse}th,td{padding:12px;border-bottom:1px solid #ddd;text-align:left}@media(max-width:640px){.page{padding:20px}.forms{grid-template-columns:1fr}}`],
})
export class EmergencyFundComponent implements OnInit {
  private fb = inject(FormBuilder); private api = inject(EmergencyFundService); private cdr = inject(ChangeDetectorRef);
  fund: EmergencyFund | null = null; movements: FundMovement[] = []; loading = true; error = ''; message = '';
  depositForm = this.fb.group({ amount: ['', [Validators.required, Validators.min(.01)]], description: [''] });
  withdrawForm = this.fb.group({ amount: ['', [Validators.required, Validators.min(.01)]], description: [''] });
  ngOnInit() { this.load(); }
  load() { this.loading = true; this.api.get().subscribe({ next: f => { this.fund = f; this.api.movements().subscribe({ next: m => { this.movements = m; this.loading = false; this.cdr.detectChanges(); }, error: () => this.fail('No se pudo cargar el historial.') }); }, error: () => this.fail('No se pudo cargar el fondo.') }); }
  move(kind: 'deposit' | 'withdraw') { const form = kind === 'deposit' ? this.depositForm : this.withdrawForm; if (form.invalid) { form.markAllAsTouched(); this.message = 'Ingresa un monto mayor que cero.'; return; } this.error = ''; this.message = ''; const v = form.getRawValue(); this.api[kind]({ amount: v.amount!, ...(v.description?.trim() ? { description: v.description.trim() } : {}) }).subscribe({ next: () => { this.message = kind === 'deposit' ? 'Depósito realizado.' : 'Retiro realizado.'; form.reset(); this.load(); }, error: (e: HttpErrorResponse) => { this.message = e.error?.error ?? 'No se pudo realizar la operación.'; this.cdr.detectChanges(); } }); }
  fail(message: string) { this.error = message; this.loading = false; this.cdr.detectChanges(); }
  money(value: string) { return formatGuatemalanCurrency(value); }
  date(value: string) { return formatDateSpanish(value); }
}
