import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      // Simulate login process
      setTimeout(() => {
        this.isLoading = false;
        console.log('Login attempt:', this.loginForm.value);
        this.router.navigate(['/dashboard']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/forgot-password']);
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
