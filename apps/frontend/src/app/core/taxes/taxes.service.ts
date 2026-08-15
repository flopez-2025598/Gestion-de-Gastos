import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { TaxCalculation, TaxCalculationRequest, TaxParameter, TaxSetting } from './taxes.model';

@Injectable({ providedIn: 'root' })
export class TaxesService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/taxes`;

  getIva(): Observable<TaxSetting> {
    return this.http.get<TaxSetting>(`${this.endpoint}/iva`);
  }

  getParameters(): Observable<TaxParameter[]> {
    return this.http.get<TaxParameter[]>(`${this.endpoint}/parameters`);
  }

  getCurrentParameters(): Observable<TaxParameter[]> {
    return this.http.get<TaxParameter[]>(`${this.endpoint}/parameters/current`);
  }

  calculate(payload: TaxCalculationRequest): Observable<TaxCalculation> {
    return this.http.post<TaxCalculation>(`${this.endpoint}/calculate`, payload);
  }
}
