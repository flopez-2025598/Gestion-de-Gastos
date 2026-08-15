import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api.config';
import type { UserRole } from '../auth/auth.model';
import type { UserProfile } from './users.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/users`;

  list(): Observable<UserProfile[]> { return this.http.get<UserProfile[]>(this.endpoint); }
  updateRole(id: number, role: UserRole): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.endpoint}/${id}/role`, { role });
  }
}
