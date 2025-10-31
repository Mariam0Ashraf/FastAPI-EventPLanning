import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';


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

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}


  login() {
    if (!this.email || !this.password) {
      alert('Please fill in both email and password.');
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Attempting login with:', loginData);

    this.http.post('http://127.0.0.1:8000/auth/login', loginData).subscribe({
      next: (res: unknown) => {
        console.log('Login successful:', res);
        alert('Login successful!');
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid email or password.');
      }
    });
  }
}
