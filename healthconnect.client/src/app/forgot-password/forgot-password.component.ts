import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'] // Reuse login CSS
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup;
  isLoading = false;
  emailSent = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      this.isLoading = true;

      // Simulate email sending process
      setTimeout(() => {
        this.isLoading = false;
        this.emailSent = true;
        console.log('Password reset email sent to:', this.forgotPasswordForm.value.email);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  sendAnotherEmail(): void {
    this.emailSent = false;
    this.forgotPasswordForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.forgotPasswordForm.controls).forEach(key => {
      this.forgotPasswordForm.get(key)?.markAsTouched();
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
