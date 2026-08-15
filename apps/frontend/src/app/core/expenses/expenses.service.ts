import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { Expense, ExpenseCategory, ExpensePayload } from './expenses.model';

@Injectable({ providedIn: 'root' })
export class ExpensesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/expenses`;
  list(): Observable<Expense[]> { return this.http.get<Expense[]>(this.endpoint); }
  listCategories(): Observable<ExpenseCategory[]> { return this.http.get<ExpenseCategory[]>(`${this.endpoint}/categories`); }
  createCategory(name: string): Observable<ExpenseCategory> { return this.http.post<ExpenseCategory>(`${this.endpoint}/categories`, { name }); }
  create(payload: ExpensePayload): Observable<Expense> { return this.http.post<Expense>(this.endpoint, payload); }
  update(id: number, payload: ExpensePayload): Observable<Expense> { return this.http.patch<Expense>(`${this.endpoint}/${id}`, payload); }
  remove(id: number): Observable<void> { return this.http.delete<void>(`${this.endpoint}/${id}`); }
}
