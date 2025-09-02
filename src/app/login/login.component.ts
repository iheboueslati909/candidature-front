import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginRequestDTO } from '../DTO/LoginRequestDTO';
import { LoginResponseDTO } from '../DTO/LoginResponseDTO';
import { StorageService } from '../auth/storage.service';
import { AuthUserService } from '../DTO/auth-user.service';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [
    CommonModule,   
    FormsModule     
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
    host: { 'ngSkipHydration': '' } 

})
export class LoginComponent implements OnInit {
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(
    private storageService: StorageService,
    private authUserService: AuthUserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }
  }

  login(loginForm: NgForm): void {
    const loginData: LoginRequestDTO = {
      username: loginForm.value.username,
      password: loginForm.value.password
    };

    this.authUserService.login(loginData).subscribe({
      next: (response: LoginResponseDTO) => {
        this.storageService.saveUser(response);
        this.storageService.saveToken(response.jwt);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = response.roles;
        this.router.navigate(['/offres']);
      },
      error: (error) => {
        this.isLoginFailed = true;
        this.errorMessage = 'Login failed. Please check your credentials.';
        console.log(error);
      }
    });
  }
}
