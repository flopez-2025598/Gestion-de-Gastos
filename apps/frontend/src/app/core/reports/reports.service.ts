import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { ExpensesByCategoryReport, IncomeVsExpensesReport } from './reports.model';
@Injectable({providedIn:'root'}) export class ReportsService { private readonly http=inject(HttpClient); private readonly endpoint=`${API_BASE_URL}/reports`; private params(from?:string,to?:string){let p=new HttpParams();if(from)p=p.set('from',from);if(to)p=p.set('to',to);return {params:p}} expenses(from?:string,to?:string):Observable<ExpensesByCategoryReport>{return this.http.get<ExpensesByCategoryReport>(`${this.endpoint}/expenses`,this.params(from,to))} incomeVsExpenses(from?:string,to?:string):Observable<IncomeVsExpensesReport>{return this.http.get<IncomeVsExpensesReport>(`${this.endpoint}/income-vs-expenses`,this.params(from,to))} }
