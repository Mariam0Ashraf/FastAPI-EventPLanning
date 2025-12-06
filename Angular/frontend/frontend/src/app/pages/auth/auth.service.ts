import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    //private api = environment.apiUrl;
 private api = (window as any).__env.apiUrl;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  register(userData: unknown): Observable<unknown> {
    console.log(" the base URI: "+this.api);
    return this.http.post(`${this.api}/register`, userData);
  }

  login(credentials: unknown): Observable<unknown> {
    return this.http.post(`${this.api}/login`, credentials);
  }
}
