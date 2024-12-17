import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

// Custom validator to check if passwords match
function passwordMatchValidator(control: AbstractControl) {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordMismatch: true });
  } else if (
    password &&
    confirmPassword &&
    password.value === confirmPassword.value
  ) {
    confirmPassword.setErrors(null);
  }

  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registrationForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthenticationService,
    private _router: Router
  ) {
    this.registrationForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        profile: [null, Validators.required],
      },
      { validators: passwordMatchValidator }
    );
  }

  // Custom Getter for Form Controls
  public get f() {
    return this.registrationForm.controls;
  }

  // Handle File Input
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.registrationForm.patchValue({ profile: file });
    }
  }

  // Handle Form Submission
  onSubmit() {
    if (this.registrationForm.invalid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    const formData = new FormData();
    Object.keys(this.registrationForm.value).forEach((key) => {
      formData.append(key, this.registrationForm.value[key]);
    });

    this.authService.register(formData).subscribe({
      next: () => {
        this.successMessage = 'Registration successful!';
        this.errorMessage = '';
        this.registrationForm.reset();
        this._router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error registering:', error);
        this.errorMessage =
          error.error.message || 'Registration failed. Please try again.';
        this.successMessage = '';
      },
    });
  }
}
