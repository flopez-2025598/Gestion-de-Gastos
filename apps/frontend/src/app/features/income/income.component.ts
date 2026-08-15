import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IncomeService } from '../../core/income/income.service';
import type { Income, IncomePayload, IncomeSource, IncomeType } from '../../core/income/income.model';
import { formatGuatemalanCurrency, formatDateSpanish } from '../../core/dashboard/dashboard.utils';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <main class="page-shell">
      <header class="page-header">
        <a routerLink="/dashboard">Volver al Dashboard</a>
        <div>
          <p class="eyebrow">Finova</p>
          <h1>Ingresos</h1>
          <p>Registra y administra tus ingresos.</p>
        </div>
      </header>

      <section class="panel">
        <h2>{{ editingIncome ? 'Editar ingreso' : 'Nuevo ingreso' }}</h2>
        <form [formGroup]="incomeForm" (ngSubmit)="saveIncome()" class="income-form">
          <label>
            <span>Fuente de ingreso</span>
            <select formControlName="incomeSourceId">
              <option [ngValue]="null">Selecciona una fuente</option>
              <option *ngFor="let source of sources" [ngValue]="source.id">{{ source.name }}</option>
            </select>
            <small *ngIf="showError('incomeSourceId', 'required')">Selecciona una fuente de ingreso.</small>
          </label>

          <label>
            <span>Tipo</span>
            <select formControlName="type">
              <option value="FIXED">Fijo</option>
              <option value="VARIABLE">Variable</option>
              <option value="EXTRAORDINARY">Extraordinario</option>
            </select>
          </label>

          <label>
            <span>Monto</span>
            <input type="number" min="0.01" step="0.01" formControlName="amount" placeholder="0.00" />
            <small *ngIf="showError('amount', 'required')">El monto es obligatorio.</small>
            <small *ngIf="showError('amount', 'min')">El monto debe ser mayor que cero.</small>
          </label>

          <label>
            <span>Fecha</span>
            <input type="date" formControlName="date" />
            <small *ngIf="showError('date', 'required')">La fecha es obligatoria.</small>
          </label>

          <label class="wide">
            <span>Descripción <em>(opcional)</em></span>
            <textarea rows="3" formControlName="description" placeholder="Agrega un detalle"></textarea>
          </label>

          <div class="form-actions wide">
            <button type="submit" [disabled]="isSaving">{{ isSaving ? 'Guardando...' : editingIncome ? 'Guardar cambios' : 'Guardar ingreso' }}</button>
            <button *ngIf="editingIncome" type="button" class="secondary" (click)="cancelEdit()">Cancelar</button>
          </div>
        </form>
        <p class="feedback success" *ngIf="successMessage">{{ successMessage }}</p>
        <p class="feedback error" *ngIf="formError">{{ formError }}</p>
      </section>

      <section class="panel source-panel">
        <h2>Agregar fuente de ingreso</h2>
        <form [formGroup]="sourceForm" (ngSubmit)="addSource()" class="source-form">
          <input formControlName="name" placeholder="Por ejemplo, salario o freelance" />
          <button type="submit" [disabled]="isAddingSource">{{ isAddingSource ? 'Agregando...' : 'Agregar fuente' }}</button>
        </form>
        <p class="feedback error" *ngIf="sourceError">{{ sourceError }}</p>
      </section>

      <section class="panel">
        <div class="section-heading">
          <h2>Historial de ingresos</h2>
          <button type="button" class="secondary" (click)="loadData()" [disabled]="isLoading">Actualizar</button>
        </div>

        <div *ngIf="isLoading" class="state">Cargando ingresos...</div>
        <div *ngIf="!isLoading && listError" class="state error-state">{{ listError }}</div>
        <div *ngIf="!isLoading && !listError && incomes.length === 0" class="state">No hay ingresos registrados.</div>

        <div *ngIf="!isLoading && !listError && incomes.length" class="table-wrapper">
          <table>
            <thead><tr><th>Fuente</th><th>Tipo</th><th>Monto</th><th>Fecha</th><th>Descripción</th><th>Acciones</th></tr></thead>
            <tbody>
              <tr *ngFor="let income of incomes">
                <td>{{ income.incomeSourceName }}</td>
                <td>{{ typeLabel(income.type) }}</td>
                <td class="amount">{{ formatCurrency(income.amount) }}</td>
                <td>{{ formatDate(income.date) }}</td>
                <td>{{ income.description || '—' }}</td>
                <td class="actions"><button type="button" class="link" (click)="editIncome(income)">Editar</button><button type="button" class="link danger" (click)="deleteIncome(income)">Eliminar</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  `,
  styles: [`
    :host { display:block; min-height:100vh; background:#f4f7fb; color:#0f172a; }
    .page-shell { max-width:1180px; margin:auto; padding:32px 24px 56px; }
    .page-header { margin-bottom:28px; } .eyebrow { margin:0 0 6px; color:#2563eb; font-weight:700; text-transform:uppercase; letter-spacing:.08em; font-size:.75rem; }
    h1,h2,p { margin-top:0; } h1 { margin-bottom:8px; font-size:2.25rem; } h2 { margin-bottom:20px; font-size:1.2rem; } .page-header > div > p:last-child { color:#64748b; margin-bottom:0; }
    .panel { background:#fff; border-radius:16px; box-shadow:0 4px 16px rgba(15,23,42,.07); padding:24px; margin-bottom:24px; }
    .income-form { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:18px; } label { display:flex; flex-direction:column; gap:7px; font-weight:600; color:#334155; } em { font-style:normal; color:#64748b; font-weight:400; }
    input,select,textarea { box-sizing:border-box; width:100%; border:1px solid #cbd5e1; border-radius:9px; padding:11px 12px; font:inherit; background:#fff; } input:focus,select:focus,textarea:focus { outline:none; border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.13); }
    small { color:#b91c1c; font-weight:400; } .wide { grid-column:1 / -1; }.form-actions,.section-heading,.source-form { display:flex; gap:12px; align-items:center; }.section-heading { justify-content:space-between; }.section-heading h2 { margin:0; }
    button { border:0; border-radius:9px; padding:11px 15px; background:#2563eb; color:#fff; font:inherit; font-weight:700; cursor:pointer; } button:disabled { opacity:.65; cursor:wait; }.secondary { background:#e2e8f0; color:#0f172a; }.source-form input { flex:1; }.feedback { margin:16px 0 0; }.success { color:#047857; }.error { color:#b91c1c; }
    .state { padding:32px 0; text-align:center; color:#64748b; }.error-state { color:#b91c1c; }.table-wrapper { overflow-x:auto; } table { width:100%; border-collapse:collapse; } th,td { text-align:left; padding:14px 10px; border-bottom:1px solid #e2e8f0; white-space:nowrap; } th { color:#64748b; font-size:.78rem; text-transform:uppercase; letter-spacing:.04em; }.amount { font-weight:700; }.actions { display:flex; gap:10px; }.link { padding:0; background:transparent; color:#2563eb; }.link.danger { color:#b91c1c; }
    @media (max-width:640px) { .page-shell { padding:24px 16px; }.panel { padding:20px 16px; }.income-form { grid-template-columns:1fr; }.wide { grid-column:auto; }.source-form { align-items:stretch; flex-direction:column; } }
  `],
})
export class IncomeComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly incomeService = inject(IncomeService);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  protected readonly incomeForm = this.fb.group({
    incomeSourceId: [null as number | null, Validators.required],
    type: ['FIXED' as IncomeType, Validators.required],
    amount: ['', [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required],
    description: [''],
  });
  protected readonly sourceForm = this.fb.group({ name: ['', Validators.required] });
  protected incomes: Income[] = [];
  protected sources: IncomeSource[] = [];
  protected editingIncome: Income | null = null;
  protected isLoading = false;
  protected isSaving = false;
  protected isAddingSource = false;
  protected listError = '';
  protected formError = '';
  protected sourceError = '';
  protected successMessage = '';

  ngOnInit(): void { this.loadData(); }

  protected loadData(): void {
    this.isLoading = true; this.listError = '';
    let incomesLoaded = false; let sourcesLoaded = false;
    const finish = () => { if (incomesLoaded && sourcesLoaded) { this.isLoading = false; this.changeDetectorRef.detectChanges(); } };
    this.incomeService.list().subscribe({ next: (incomes) => { this.incomes = incomes; incomesLoaded = true; finish(); }, error: () => { this.listError = 'No se pudieron cargar los ingresos. Intenta nuevamente.'; incomesLoaded = true; finish(); } });
    this.incomeService.listSources().subscribe({ next: (sources) => { this.sources = sources; sourcesLoaded = true; finish(); }, error: () => { this.listError = 'No se pudieron cargar las fuentes de ingreso.'; sourcesLoaded = true; finish(); } });
  }

  protected saveIncome(): void {
    this.formError = ''; this.successMessage = '';
    if (this.incomeForm.invalid) { this.incomeForm.markAllAsTouched(); return; }
    this.isSaving = true;
    const value = this.incomeForm.getRawValue();
    const payload: IncomePayload = { incomeSourceId: value.incomeSourceId!, type: value.type!, amount: value.amount!, date: value.date!, ...(value.description?.trim() ? { description: value.description.trim() } : {}) };
    const request = this.editingIncome ? this.incomeService.update(this.editingIncome.id, payload) : this.incomeService.create(payload);
    request.subscribe({ next: () => { this.successMessage = this.editingIncome ? 'Ingreso actualizado correctamente.' : 'Ingreso registrado correctamente.'; this.cancelEdit(); this.isSaving = false; this.loadData(); }, error: (error: HttpErrorResponse) => { this.formError = error.error?.error ?? 'No se pudo guardar el ingreso.'; this.isSaving = false; this.changeDetectorRef.detectChanges(); } });
  }

  protected addSource(): void {
    this.sourceError = '';
    if (this.sourceForm.invalid) { this.sourceForm.markAllAsTouched(); this.sourceError = 'Ingresa el nombre de la fuente.'; return; }
    this.isAddingSource = true;
    this.incomeService.createSource(this.sourceForm.getRawValue().name!.trim()).subscribe({ next: (source) => { this.sources = [...this.sources, source].sort((a, b) => a.name.localeCompare(b.name)); this.incomeForm.patchValue({ incomeSourceId: source.id }); this.sourceForm.reset(); this.isAddingSource = false; this.changeDetectorRef.detectChanges(); }, error: (error: HttpErrorResponse) => { this.sourceError = error.error?.error ?? 'No se pudo crear la fuente.'; this.isAddingSource = false; this.changeDetectorRef.detectChanges(); } });
  }

  protected editIncome(income: Income): void { this.editingIncome = income; this.incomeForm.setValue({ incomeSourceId: income.incomeSourceId, type: income.type, amount: income.amount, date: income.date.slice(0, 10), description: income.description ?? '' }); this.successMessage = ''; this.formError = ''; window.scrollTo({ top: 0, behavior: 'smooth' }); }
  protected cancelEdit(): void { this.editingIncome = null; this.incomeForm.reset({ incomeSourceId: null, type: 'FIXED', amount: '', date: '', description: '' }); }
  protected deleteIncome(income: Income): void { if (!window.confirm(`¿Eliminar el ingreso de ${income.incomeSourceName}?`)) return; this.listError = ''; this.incomeService.remove(income.id).subscribe({ next: () => { this.successMessage = 'Ingreso eliminado correctamente.'; this.loadData(); }, error: (error: HttpErrorResponse) => { this.listError = error.error?.error ?? 'No se pudo eliminar el ingreso.'; this.changeDetectorRef.detectChanges(); } }); }
  protected showError(name: 'incomeSourceId' | 'amount' | 'date', error: string): boolean { const control = this.incomeForm.get(name); return !!control && control.touched && control.hasError(error); }
  protected formatCurrency(value: string): string { return formatGuatemalanCurrency(value); }
  protected formatDate(value: string): string { return formatDateSpanish(value); }
  protected typeLabel(type: IncomeType): string { return ({ FIXED: 'Fijo', VARIABLE: 'Variable', EXTRAORDINARY: 'Extraordinario' })[type]; }
}
