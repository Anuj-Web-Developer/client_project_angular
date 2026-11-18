import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { UserListModel } from '../Model/userlistmodel';
import { Userlist } from '../Service/userlist';
import { AddUserService } from '../Service/add-user-service';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularDualListBoxModule } from 'angular-dual-listbox';
import { ProjectService } from '../../project/Service/project-service';
import { UserProjectModel } from '../Model/user-project-model';
import { OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard/Service/dashboard-service';

@Component({
  selector: 'app-user-add',
  imports: [RouterModule, FormsModule, CommonModule, AngularDualListBoxModule],
  templateUrl: './user-add.html',
  styleUrl: './user-add.css',
})

export class UserAdd implements OnInit{

  userId!: number;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  confirmPassword: string = '';

  user: UserListModel = {
    id: 0,
    name: '',
    designation: '',
    contactNo: '',
    email: '',
    password: '',
    status: 1,
    employeeId: '',
    project: [],
    roles: [],
    isAllowedCreateProject: false,
    username: ''
  };

  availableProject: UserProjectModel[] = [];

  selectedProject: UserProjectModel[] = [];

  backendErrors: { [key: string]: string } = {}

  dualConfig = {
    displayKey: 'name',
    key: 'id'
  };

  role:string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: Userlist,
    private toast: ToastrService,
    private router: Router,
    private service: AddUserService,
    private cdr: ChangeDetectorRef,
    private projectServ: ProjectService,
    
  ) { }

  ngOnInit(){
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId>0) { 
      this.editUser();     
    }
    this.getProjectList();
    this.cdr.detectChanges();  
  }


  saveUser() {

    this.user.project = this.selectedProject;

    if (this.user.password !== this.confirmPassword) {
      alert("Password and Confirm Password do not match.");
      return;
    }

    this.service.addUserService(this.user).subscribe({
      next: (data) => {
        // this.toast.success("User Registered Successfully");
        this.router.navigate(["/user"]);
      },
      error: (err) => {
        
        if (err.status === 400) {
          this.backendErrors = JSON.parse(err.error);
          console.log(err);
          
        }
        this.cdr.detectChanges();
      }
    });
    this.reset();
  }

  editUser() {
    this.userService.findUserService(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.selectedProject = this.user.project;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error("err.error");
      }
    });
  }

  updateUser() {

    if (this.confirmPassword.length > 0) {
      this.user.password = this.confirmPassword;
    }

    this.user.project = this.selectedProject;

    this.userService.editUserService(this.user).subscribe({
      next: (data) => {
        // this.toast.success(data);
        this.reset();
        this.router.navigate(["/user"]);
      },
      error: (err) => {

         if (err.status === 400) {
          this.backendErrors = JSON.parse(err.error);
          console.log(err);
          
         }
         this.cdr.detectChanges();
      }
    });
  }

  getProjectList() {
    this.service.getProjectList().subscribe({
      next: (response) => {
        this.availableProject = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  reset() {
    const user = {
      id: 0,
      name: '',
      email: '',
      employeeId: '',
      contactNo: '',
      designation: '',
      status: 0
    }
  }

  back() {
    this.router.navigate(["/user"]);
  }

}

