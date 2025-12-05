// Angular imports
import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, HttpClientModule, CommonModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../authentication.scss']
})
export default class RegisterComponent {
  //  Fields for form data
  hide = true;
  coHide = true;

  username: string = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password: string = '';
  confirmPassword: string = '';
  private api = environment.apiUrl;




  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient,private router:Router) {}

  // Handle validation message for email
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter an email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  //  Registration logic
  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email.value,
      password: this.password,
      confirmPassword: this.confirmPassword
    };

    console.log('Registering user:', userData);

    // Send to FastAPI backend
    this.http.post(`${this.api}/auth/register`, userData).subscribe({
      next: (res: unknown) => {
        console.log('Registration successful:', res);
        alert(`Registered successfully`);
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        const msg =
          err.error?.detail ||
          err.error?.message ||
          'Registration failed. Check console.';
        alert(msg);
      }
    });
  }
}
