import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
export interface EmergencyFund { id:number; userId:number; balance:string; createdAt:string; updatedAt:string; }
export interface FundMovement { id:number; emergencyFundId:number; type:'DEPOSIT'|'WITHDRAWAL'; amount:string; date:string; description:string|null; createdAt:string; }
export interface FundMovementPayload { amount:string; description?:string; }
@Injectable({providedIn:'root'}) export class EmergencyFundService { private readonly http=inject(HttpClient); private readonly endpoint=`${API_BASE_URL}/emergency-fund`; get():Observable<EmergencyFund>{return this.http.get<EmergencyFund>(this.endpoint)} movements():Observable<FundMovement[]>{return this.http.get<FundMovement[]>(`${this.endpoint}/movements`)} deposit(payload:FundMovementPayload):Observable<EmergencyFund>{return this.http.post<EmergencyFund>(`${this.endpoint}/deposit`,payload)} withdraw(payload:FundMovementPayload):Observable<EmergencyFund>{return this.http.post<EmergencyFund>(`${this.endpoint}/withdraw`,payload)} }
