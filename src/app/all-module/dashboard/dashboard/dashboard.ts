import { Component } from '@angular/core';
import { DashboardService } from '../Service/dashboard-service';
import { ToastrService } from 'ngx-toastr';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Userlist } from '../../user/Service/userlist';
import { UserListModel } from '../../user/Model/userlistmodel';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../customer/Service/customer-service';
import { CustomerListModel } from '../../customer/Model/customer-list-model';
import { ProjectService } from '../../project/Service/project-service';
import { ProjectListModel } from '../../project/Model/project-list-model';
import { ProjectViewModel } from '../../project/Model/project-view-model';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  totalUser!: number;
  totalCustomer!: number;
  totalProject!: number;
  userList: UserListModel[] = [];
  customerList: CustomerListModel[] = [];
  projectList: ProjectViewModel[] = [];
  role: string = null;

  constructor(
    private service: DashboardService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private userService: Userlist,
    private customerServ: CustomerService,
    private projectServ: ProjectService
  ) { }

  ngOnInit(): void {

    this.getRole();
    this.cdr.detectChanges();
  }

  countUser() {
    this.service.countUserService().subscribe({
      next: (data: number) => {
        this.totalUser = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

  countCustomer() {
    this.service.countCustomerService().subscribe({
      next: (data) => {
        this.totalCustomer = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

  countProject() {
    this.service.countProjectService().subscribe({
      next: (data) => {
        this.totalProject = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

  recentAddedUsers() {
    this.userService.userListService().subscribe({
      next: (list) => {
        this.userList = list.slice(0, 3);
        // console.log(this.userList);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.console.error);
      }
    })
  }

  recentAddedCustomers() {
    this.customerServ.customerListService().subscribe({
      next: (list) => {
        this.customerList = list.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.console.error);
      }
    })
  }

  recentAddedProject() {
    this.projectServ.getProjectListService().subscribe({
      next: (list) => {
        this.projectList = list.slice(0, 3);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    })
  }

  getRole() {
    this.service.getRoleService().subscribe({
      next: (response) => {
        this.role = response;
        this.cdr.detectChanges();
        if (response === 'ROLE_ADMIN') {
          this.countUser();
          this.countCustomer();
          this.countProject();
          this.recentAddedUsers();
          this.recentAddedCustomers();
          this.recentAddedProject();
        }
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

}
