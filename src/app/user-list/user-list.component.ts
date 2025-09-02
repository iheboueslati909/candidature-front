import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthUserService } from '../DTO/auth-user.service';
import { UserResponseDTO } from '../DTO/UserResponseDTO';
import { ChangeDetectorRef } from '@angular/core';



interface CustomPageEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class UserListComponent implements OnInit {
  users: UserResponseDTO[] = [];
  
  totalItems = 0;
  pageSize = 10;
  currentPage = 0;
  currentSearch = '';
  totalPages = 0;

  constructor(private userService: AuthUserService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
  if (this.currentSearch.trim()) {
    this.userService.searchUsers(this.currentSearch, this.currentPage, this.pageSize).subscribe(data => {
      console.log('Search response:', data);
      this.users = data.content;
      this.totalItems = data.totalElements;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    });
  } else {
    this.userService.getAllUsers(this.currentPage, this.pageSize).subscribe(data => {
      console.log('All users response:', data);
      this.users = data.content;
      this.totalItems = data.totalElements;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);
          this.cdr.detectChanges(); // force update

    });
  }
}
  onSearch(event: any): void {
    this.currentSearch = event.target.value.trim();
    this.currentPage = 0;
    this.fetchUsers();
  }

  onPageChange(event: CustomPageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.fetchUsers();
  }
}