import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { CustomerListModel } from '../Model/customer-list-model';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../Service/customer-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-add-customer',
  imports: [CommonModule, FormsModule],
  templateUrl: './add-customer.html',
  styleUrl: './add-customer.css',
})
export class AddCustomer implements OnInit {

  customerId: number = 0;
  customer: CustomerListModel = {
    id:null,
    name: '',
    email: '',
    contact: '',
    address: '',
    billingAddress: '',
    companyName: '',
    gstNo: '',
    status: 1,
    password: ''
 
  };
  backendErrors:{[key:string]:string} = {}


  constructor(
    private route: ActivatedRoute,
    private service: CustomerService,
    private router: Router,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.customerId > 0) {
      this.getCustomer(this.customerId);
    }
  }

  saveCustomer() {
    this.service.saveCustomer(this.customer).subscribe({
      next: (data) => {
        // this.toast.success(data);
        this.reset();
        this.router.navigate(["/customer"]);
      },
      error: (err) => {
       
        if(err.status === 400) {
          this.backendErrors = JSON.parse(err.error);
          console.log(this.backendErrors);
          this.cdr.detectChanges();
        }
      }
    });
  }

  getCustomer(customerId: number) {
    this.service.getCustomerService(customerId).subscribe({
      next: (data) => {
        this.customer = data;
        this.cdr.detectChanges();
        // this.toast.success("Customer fetched");
      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }
  updateCustomer() {
    this.service.updateCustomerService(this.customer).subscribe({
      next: (data) => {
        // this.toast.success(data);
        this.router.navigate(["/customer"]);
      },
      error: (err) => {
        
        if(err.status === 400) {
          this.backendErrors = JSON.parse(err.error);
          console.log(this.backendErrors);
          this.cdr.detectChanges();
        }
      }
    });
  }

  sameAddress: boolean = false;

  copyAddress(): void {

    if (this.sameAddress) {

      this.customer.billingAddress = this.customer.address;

    } else {

      this.customer.billingAddress = '';

    }

  }

  syncBillingAddress(): void {

    if (this.sameAddress) {

      this.customer.billingAddress = this.customer.address;

    }
  }

  reset() {
    this.customer = null;
  }

  back() {
    this.router.navigate(["/customer"]);
  }
  
}
