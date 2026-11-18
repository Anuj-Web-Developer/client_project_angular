import { Component } from '@angular/core';
import { CustomerDashboardService } from '../Service/customer-dashboard-service';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CustomerModel } from '../Model/customer-model';
import { ProjectModel } from '../Model/project-model';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectList } from '../../project/project-list/project-list';
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-customer-dashboard-component',
  imports: [RouterLink, CommonModule, RouterModule, FormsModule],
  templateUrl: './customer-dashboard-component.html',
  styleUrl: './customer-dashboard-component.css',
})
export class CustomerDashboardComponent implements OnInit {

  customerData: CustomerModel;
  projectList: ProjectModel[] = [];
  customerId: number = 0;
  isUpdatePassword: boolean = false;
  projectId: number = null;


  constructor(
    private service: CustomerDashboardService,
    private toast: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getCustomerData();
  }

  getCustomerData() {
    this.service.getCustomerProfile().subscribe({
      next: (response) => {
        this.customerData = response;
        this.customerId = this.customerData.id;
        this.getProjectListCom();
        console.log(this.customerData);
        // this.toast.success("Customer data fetched");
        this.cdr.detectChanges();

      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }


  getProjectListCom() {
    if (this.customerId == 0) {
      return;
    }
    this.service.getProjectList(this.customerId).subscribe({
      next: (response) => {
        this.projectList = response;
        console.log(this.projectList);
        // this.toast.success("Project list fetched");
        this.cdr.detectChanges();

      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }

  // ************************* Update Project Password ****************************************

  editPassword(projectId: number) {
    this.projectId = projectId;
    if (this.isUpdatePassword) {
      this.isUpdatePassword = false;
    } else {
      this.isUpdatePassword = true;
    }
  }

  updateProjectPassword(project: ProjectModel) {
    this.service.updateProjectPasswordService(project).subscribe({
      next: (response) => {
        this.toast.success(response);
        this.isUpdatePassword = false;
        this.projectId = 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }

  logout() {
    this.service.logoutCustomer().subscribe({
      next: (response) => {
        sessionStorage.clear();
        localStorage.clear();
        this.toast.success(response);
        this.router.navigate(['/customer/login']);
      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }

  // testingMethod() {
  //   this.service.testingMethodService().subscribe({
  //     next: (Response) => {
  //       this.toast.success(Response);
  //       console.log(Response);
  //     },
  //     error: (err) => {
  //       this.toast.error(err.error);
  //       console.log(err);
  //     }
  //   });
  // }

  getHiddenPassword(password: string): string {
    return '*'.repeat(password?.length || 0);
  }

  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success("clipboard copied successfull");
    }).catch(err => {
      this.toast.error("Copy failed", err);
    })
  }

}
