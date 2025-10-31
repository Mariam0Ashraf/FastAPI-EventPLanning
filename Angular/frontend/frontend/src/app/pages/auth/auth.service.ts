import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000';

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  register(userData: unknown): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  login(credentials: unknown): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }
}
