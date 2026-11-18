import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerListModel } from '../Model/customer-list-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../Service/customer-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../../project/Service/project-service';
import { ProjectViewModel } from '../../project/Model/project-view-model';

@Component({
  selector: 'app-view-customer',
  imports: [FormsModule, CommonModule],
  templateUrl: './view-customer.html',
  styleUrl: './view-customer.css',
})
export class ViewCustomer implements OnInit {

  customerId!:number;
  customer:CustomerListModel;
  projectList:ProjectViewModel[]=[];

  constructor(
    private route: ActivatedRoute,
    private service: CustomerService,
    private router: Router,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private projectServ: ProjectService
  ){}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    this.getCustomer();
    this.findProjectByCustomerId();
  }

  getCustomer() {
    this.service.getCustomerService(this.customerId).subscribe({
      next:(data) => {
        // this.toast.success("Customer data fetched successfully");
        this.customer = data;
        this.cdr.detectChanges();
      },
      error:(err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }

  findProjectByCustomerId() {
    this.projectServ.findByCustomerId(this.customerId).subscribe({
      next:(list) => {
        this.projectList = list;
        this.cdr.detectChanges();
      
      },
      error:(err) => {
        console.log(err);
        // this.toast.error(err.error);
      }
    })
  }

  reset() {
    this.customer=null;
  }

  back(){
    this.router.navigate(["/customer"]);
  }
}
