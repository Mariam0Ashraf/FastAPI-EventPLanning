// users-data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UsersDataService {
  private api = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUserById(userId: string): Observable<{ email: string; }> {
    return this.http.get<{ email: string;}>(`${this.api}/auth/${userId}`);
  }
}
