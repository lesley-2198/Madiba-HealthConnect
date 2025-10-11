import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService, LoginResponse } from '../services/auth.service'; // Adjust path as needed

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // Inject AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response: LoginResponse) => {
          this.isLoading = false;
          console.log('Login successful:', response);

          // Redirect based on role
          this.redirectBasedOnRole(response.user.role);
        },
        error: (error: any) => {
          this.isLoading = false;
          console.error('Login failed:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'Student':
        this.router.navigate(['/dashboard']);
        break;
      case 'Nurse':
        this.router.navigate(['/nurse-dashboard']);
        break;
      case 'Admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
    }
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }

  navigateToCreateAccount(): void {
    this.router.navigate(['/create-account']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  private mandelaEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const email = control.value as string;
      const isValid = email.toLowerCase().endsWith('@mandela.ac.za');

      return isValid ? null : { invalidAcademicEmail: true };
    };
  }
}
