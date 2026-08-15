import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { Income, IncomePayload, IncomeSource } from './income.model';

@Injectable({ providedIn: 'root' })
export class IncomeService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/income`;

  list(): Observable<Income[]> {
    return this.http.get<Income[]>(this.endpoint);
  }

  listSources(): Observable<IncomeSource[]> {
    return this.http.get<IncomeSource[]>(`${this.endpoint}/sources`);
  }

  createSource(name: string): Observable<IncomeSource> {
    return this.http.post<IncomeSource>(`${this.endpoint}/sources`, { name });
  }

  create(payload: IncomePayload): Observable<Income> {
    return this.http.post<Income>(this.endpoint, payload);
  }

  update(id: number, payload: IncomePayload): Observable<Income> {
    return this.http.patch<Income>(`${this.endpoint}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
