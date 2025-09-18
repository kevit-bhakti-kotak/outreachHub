import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
  if (this.loginForm.invalid) return;
  const { email, password } = this.loginForm.value;

  this.authService.login(email!, password!).subscribe({
    next: (user) => {
      if (user?.isAdmin) {
        this.router.navigate(['/workspaces']); // ✅ only navigate once admin check is done
      }
    },
    error: (err) => alert('Login failed: ' + (err.error?.message || 'Unknown error'))
  });
}

}
