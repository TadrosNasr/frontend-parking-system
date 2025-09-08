import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  login() {
    this.api.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        // Support both res.role and res.user.role
        const role = res.role || res.user?.role;
        const token = res.token || res.user?.token;
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }
        if (role === 'admin' || role === 'employee') {
          localStorage.setItem('role', role);
          if (token) {
            localStorage.setItem('token', token);
          }
          if (role === 'admin') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/employee']);
          }
        } else {
          this.error = 'Invalid role';
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Invalid credentials';
      }
    });
  }
}
