import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['../log-in/log-in.component.css'] // Reuse login CSS
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.createAccountForm = this.fb.group({
      studentNumber: ['', [Validators.required, Validators.pattern(/^s\d{9}$/)]],
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      campus: ['', Validators.required],
      course: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator() });
  }

  onSubmit(): void {
    if (this.createAccountForm.valid) {
      this.isLoading = true;

      // Simulate account creation process
      setTimeout(() => {
        this.isLoading = false;
        this.showSuccessMessage = true;
        console.log('Account creation:', this.createAccountForm.value);

        // Redirect to login after showing success message
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToTerms(): void {
    this.router.navigate(['/terms-conditions']);
  }

  navigateToPrivacyPolicy(): void {
    this.router.navigate(['/privacy-policy']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.createAccountForm.controls).forEach(key => {
      this.createAccountForm.get(key)?.markAsTouched();
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
