import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoleResponseDTO } from '../DTO/RoleResponseDTO';
import { UserResponseDTO } from '../DTO/UserResponseDTO';
import { UserRoleRequestDTO } from '../DTO/UserRoleRequestDTO';
import { AuthUserService } from '../DTO/auth-user.service';
import { RoleService } from '../auth/role.service';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  userId!: string;
  user!: UserResponseDTO;
  newRole: string = '';
  roles: RoleResponseDTO[] = [];
  availableRoles: RoleResponseDTO[] = [];
  rolesPage = 0;
  rolesSize = 20;
  totalRoles = 0;

  constructor(
    private route: ActivatedRoute,
    private userService: AuthUserService,
    private router: Router,
    private roleService: RoleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id')!;
    this.loadUser();
    this.loadRoles();
  }

 loadUser() {
  this.userService.getUserById(this.userId).subscribe((data) => {
    this.user = data;
    console.log('user details loaded:', this.user);
    this.cdr.detectChanges(); // force Angular to update view

    if (this.roles.length) {
      this.filterAvailableRoles();
      this.cdr.detectChanges(); // update after filtering roles
    }
  });
}

loadRoles(page: number = 0) {
  this.roleService.getRoles(page, this.rolesSize).subscribe((data) => {
    this.roles = data.content;
    this.rolesPage = data.number;
    this.totalRoles = data.totalElements;
    console.log('user roles loaded:', this.roles);
    this.cdr.detectChanges(); // force update

    if (this.user) {
      this.filterAvailableRoles();
      this.cdr.detectChanges();
    }
  });
}

  toggleStatus() {
    this.userService
      .updateUserStatus(this.userId)
      .subscribe(() => this.loadUser());
  }

  deleteUser() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(this.userId).subscribe(() => {
          Swal.fire('Deleted!', 'The user has been deleted.', 'success');
          this.router.navigate(['/admin/users']);
        });
      }
    });
  }

  addRole() {
    const dto: UserRoleRequestDTO = {
      username: this.user.username,
      roleName: this.newRole,
    };
    this.userService.addRoleToUser(dto).subscribe(() => {
      this.newRole = '';
      this.loadUser();
    });
  }

  removeRole(roleName: string) {
    const dto: UserRoleRequestDTO = {
      username: this.user.username,
      roleName: roleName,
    };
    this.userService.removeRoleFromUser(dto).subscribe(() => this.loadUser());
  }

  goBack() {
    this.router.navigate(['/user/list']);
  }

  filterAvailableRoles() {
    this.availableRoles = this.roles.filter(
      (role) => !this.user.roles.includes(role.name)
    );
  }
}