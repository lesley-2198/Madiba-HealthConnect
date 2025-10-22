import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'] // Reuse login CSS
})
export class CreateAccountComponent {
  createAccountForm: FormGroup;
  isLoading = false;
  showSuccessMessage = false;
  showCourseDropdown = false;

  // Password requirements for UI display
  passwordRequirements = {
    minLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  };

  // List of courses offered at Nelson Mandela University
  allCourses: string[] = [
    'Bachelor of Accounting',
    'Bachelor of Accounting Science',
    'Bachelor of Arts',
    'Bachelor of Arts in Drama',
    'Bachelor of Arts in Music',
    'Bachelor of Business Administration',
    'Bachelor of Commerce',
    'Bachelor of Commerce in Economics',
    'Bachelor of Commerce in Finance',
    'Bachelor of Commerce in Human Resource Management',
    'Bachelor of Commerce in Marketing',
    'Bachelor of Commerce in Supply Chain Management',
    'Bachelor of Computer Science',
    'Bachelor of Education',
    'Bachelor of Engineering Technology in Civil Engineering',
    'Bachelor of Engineering Technology in Electrical Engineering',
    'Bachelor of Engineering Technology in Mechanical Engineering',
    'Bachelor of Information Technology',
    'Bachelor of Laws',
    'Bachelor of Nursing',
    'Bachelor of Pharmacy',
    'Bachelor of Science',
    'Bachelor of Science in Biochemistry',
    'Bachelor of Science in Biotechnology',
    'Bachelor of Science in Chemistry',
    'Bachelor of Science in Computer Science',
    'Bachelor of Science in Environmental Science',
    'Bachelor of Science in Mathematics',
    'Bachelor of Science in Microbiology',
    'Bachelor of Science in Physics',
    'Bachelor of Science in Psychology',
    'Bachelor of Social Work',
    'Bachelor of Sport Science',
    'Bachelor of Tourism Management',
    'Diploma in Accounting',
    'Diploma in Business Management',
    'Diploma in Chemical Engineering',
    'Diploma in Civil Engineering',
    'Diploma in Electrical Engineering',
    'Diploma in Information Technology',
    'Diploma in Mechanical Engineering',
    'Diploma in Office Management and Technology',
    'Diploma in Sport Management'
  ];

  filteredCourses: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.createAccountForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s'-]+$/)]],
      email: ['', [Validators.required, Validators.email, this.mandelaEmailValidator()]],
      cellphone: ['', [Validators.required, Validators.pattern(/^(\+27|0)[1-9][0-9]{8}$/)]],
      campus: ['', Validators.required],
      course: ['', [Validators.required, this.validCourseValidator()]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordComplexityValidator()]],
      confirmPassword: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator() });

    // Initialize filtered courses with all courses
    this.filteredCourses = [...this.allCourses];

    // Watch password changes to update requirements UI
    this.createAccountForm.get('password')?.valueChanges.subscribe(password => {
      this.updatePasswordRequirements(password);
    });
  }

  private capitalizeName(name: string): string {
    if (!name) return '';
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }


  private passwordComplexityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || control.value.length < 8) {
        return null; // Let minLength validator handle this
      }

      const password = control.value as string;
      const errors: ValidationErrors = {};

      // Check for at least one uppercase letter
      if (!/(?=.*[A-Z])/.test(password)) {
        errors['missingUpperCase'] = true;
      }

      // Check for at least one lowercase letter
      if (!/(?=.*[a-z])/.test(password)) {
        errors['missingLowerCase'] = true;
      }

      // Check for at least one number
      if (!/(?=.*\d)/.test(password)) {
        errors['missingNumber'] = true;
      }

      // Special character is optional, so we don't validate it
      // Only show in UI as recommended but not required

      return Object.keys(errors).length > 0 ? errors : null;
    };
  }

  private updatePasswordRequirements(password: string): void {
    this.passwordRequirements = {
      minLength: password.length >= 8,
      hasUpperCase: /(?=.*[A-Z])/.test(password),
      hasLowerCase: /(?=.*[a-z])/.test(password),
      hasNumber: /(?=.*\d)/.test(password),
      hasSpecialChar: /(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)
    };
  }

  filterCourses(): void {
    const courseValue = this.createAccountForm.get('course')?.value?.toLowerCase() || '';

    if (courseValue === '') {
      this.filteredCourses = [...this.allCourses];
    } else {
      this.filteredCourses = this.allCourses.filter(course =>
        course.toLowerCase().includes(courseValue)
      );
    }
  }

  selectCourse(course: string): void {
    this.createAccountForm.patchValue({ course: course });
    this.showCourseDropdown = false;
    // Clear any existing validation errors when a course is selected
    this.createAccountForm.get('course')?.setErrors(null);
  }

  onCourseBlur(): void {
    // Use setTimeout to allow click event to register before hiding dropdown
    setTimeout(() => {
      this.showCourseDropdown = false;

      // Validate the course when the field loses focus
      const courseControl = this.createAccountForm.get('course');
      const courseValue = courseControl?.value;

      if (courseValue && !this.allCourses.includes(courseValue)) {
        courseControl?.setErrors({ invalidCourse: true });
      }
    }, 200);
  }

  onSubmit(): void {
    console.log('Form validity:', this.createAccountForm.valid);
    console.log('Form errors:', this.createAccountForm.errors);
    console.log('Password errors:', this.createAccountForm.get('password')?.errors);
    console.log('Course errors:', this.createAccountForm.get('course')?.errors);

    if (this.createAccountForm.valid) {
      // Double-check that the course is valid before submitting
      const courseValue = this.createAccountForm.get('course')?.value;
      if (!this.allCourses.includes(courseValue)) {
        this.createAccountForm.get('course')?.setErrors({ invalidCourse: true });
        this.markFormGroupTouched();
        return;
      }

      this.isLoading = true;

      // Capitalize first and last names before saving
      const firstName = this.capitalizeName(this.createAccountForm.get('firstName')?.value);
      const lastName = this.capitalizeName(this.createAccountForm.get('lastName')?.value);

      // Combine into FullName for backend
      const fullName = `${firstName} ${lastName}`;

      // Extract student number from email for backend processing
      const email = this.createAccountForm.get('email')?.value;
      const studentNumber = this.extractStudentNumberFromEmail(email);

      // Prepare data for backend (match RegisterDto structure)
      const registerData = {
        email: email,
        password: this.createAccountForm.get('password')?.value,
        fullName: fullName,
        studentNumber: studentNumber,
        campus: this.createAccountForm.get('campus')?.value,
        course: courseValue,
        phoneNumber: this.createAccountForm.get('cellphone')?.value
      };

      // ACTUALLY CALL THE BACKEND API
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showSuccessMessage = true;
          console.log('Account created successfully:', response);

          // Redirect to login after showing success message
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Registration failed:', error);

          // Show error message to user
          let errorMessage = 'Registration failed. Please try again.';

          if (error.error?.errors) {
            // Handle Identity errors (array of error objects)
            const identityErrors = error.error.errors;
            errorMessage = identityErrors.map((err: any) => err.description).join(', ');
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          alert(errorMessage); // Consider using a better UI notification
        }
      });
    } else {
      this.markFormGroupTouched();
      console.log('Form is invalid - showing validation errors');
    }
  }

  private validCourseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const courseValue = control.value as string;
      const isValid = this.allCourses.includes(courseValue);

      return isValid ? null : { invalidCourse: true };
    };
  }

  private extractStudentNumberFromEmail(email: string): string {
    if (!email) return '';

    // Extract the part before @mandela.ac.za and remove any non-alphanumeric characters
    const emailParts = email.split('@');
    if (emailParts.length > 0) {
      return emailParts[0].toLowerCase();
    }
    return '';
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
      const control = this.createAccountForm.get(key);
      if (control) {
        control.markAsTouched();
      }
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
