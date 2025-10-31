// Angular imports
import { Component } from '@angular/core';
import { FormControl, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Project import
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, RouterModule, FormsModule, HttpClientModule ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../authentication.scss']
})
export default class RegisterComponent {
  // 🔹 Fields for form data
  hide = true;
  coHide = true;

  username: string = '';
  email = new FormControl('', [Validators.required, Validators.email]);
  password: string = '';
  confirmPassword: string = '';




  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(private http: HttpClient) {}

  // 🔹 Handle validation message for email
  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter an email';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  // 🔹 Registration logic
  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const userData = {
      username: this.username,
      email: this.email.value,
      password: this.password,

    };

    console.log('Registering user:', userData);

    // Send to FastAPI backend
    this.http.post('http://127.0.0.1:8000/auth/register', userData).subscribe({
      next: (res: unknown) => {
        console.log('Registration successful:', res);
        alert(`Registered successfully`);
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Registration failed. Check console for details.');
      }
    });
  }
}
