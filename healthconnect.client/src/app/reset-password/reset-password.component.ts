import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../log-in/log-in.component.css'] // Reuse login CSS
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  isLoading = false;
  passwordReset = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator() });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      this.isLoading = true;

      // Simulate password reset process
      setTimeout(() => {
        this.isLoading = false;
        this.passwordReset = true;
        console.log('Password reset for:', this.resetPasswordForm.value.email);

        // Redirect to login after showing success message
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.resetPasswordForm.controls).forEach(key => {
      this.resetPasswordForm.get(key)?.markAsTouched();
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

  // In reset-password.component.ts
  private passwordHistoryValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const newPassword = control.value;
      // This would call a service to check against password history
      // const isPreviousPassword = this.authService.checkPasswordHistory(newPassword);
      // return isPreviousPassword ? { previousPassword: true } : null;
      return null; // Placeholder for future implementation
    };
  }

  private passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = formGroup.get('password');
      const confirmPassword = formGroup.get('confirmPassword');

      if (!password || !confirmPassword) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }
}
