import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthUserService } from '../DTO/auth-user.service';
import { Gender } from '../DTO/Gender';
import { UserRequestDTO } from '../DTO/UserRequestDTO';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [
    CommonModule, // for *ngIf, *ngFor, etc.
    FormsModule   // for NgForm
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
    host: { 'ngSkipHydration': '' } // 👈 skip hydration on this component

})
export class RegisterComponent {
  constructor(
    private authUserService: AuthUserService,
    private router: Router
  ) {}

  register(registerForm: NgForm): void {
    if (registerForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields.',
        customClass: {
          popup: 'swal-dark'
        }
      });
      return;
    }

    const formValue = registerForm.value;
    const user: UserRequestDTO = {
      firstname: formValue.firstname,
      lastname: formValue.lastname,
      placeOfBirth: formValue.placeOfBirth,
      dateOfBirth: formValue.dateOfBirth,
      nationality: formValue.nationality,
      gender: formValue.gender as Gender,
      cin: formValue.cin,
      email: formValue.email,
      username: formValue.username,
      password: formValue.password
    };

    this.authUserService.createUser(user).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful!',
          text: 'You have been successfully registered.',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-dark'
          }
        }).then(() => {
          this.router.navigate(['/login']);
        });
      },
      error: (error) => {
        const errorText = error.error?.message || 'Please check your data and try again.';
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: errorText,
          customClass: {
            popup: 'swal-dark'
          }
        });
        console.error(error);
      }
    });
  }
}
