import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';



import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authentication.scss']
})
export default class LoginComponent {

  hide = true;
  email: string = '';
  password: string = '';
    //private api = environment.apiUrl;
  private api = (window as any).__env.apiUrl;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient, private router:Router) {}


  login() {
    /*if (!this.email || !this.password) {
      alert('Please fill in both email and password.');
      return;
    }*/

    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Attempting login with:', loginData);

    this.http.post<any>(`${this.api}/auth/login`, loginData).subscribe({
      next: (res) => {
        console.log('Login successful:', res);
        localStorage.setItem('token', res.access_token);
        alert('Login successful!');
        this.router.navigate(['/events']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        if (err.error?.detail) {
        alert(err.error.detail);
      } else {
        alert('Invalid email or password.');
      }
    }
      
    });
  }
}