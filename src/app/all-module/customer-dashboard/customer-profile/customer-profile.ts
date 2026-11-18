import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomerDashboardService } from '../Service/customer-dashboard-service';
import { CustomerModel } from '../Model/customer-model';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-customer-profile',
  imports: [RouterLink],
  templateUrl: './customer-profile.html',
  styleUrl: './customer-profile.css',
})
export class CustomerProfile implements OnInit {

  customerId:number=0;
  customerData: CustomerModel;
  constructor(
    private route: ActivatedRoute,
    private customerServ: CustomerDashboardService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('id'));
    if(this.customerId !=0) {
      this.getCustomerData();
    }
  }

  getCustomerData() {
    this.customerServ.getCustomerByIdService(this.customerId).subscribe({
      next:(response) => {
        this.customerData = response;
        this.cdr.detectChanges();
      },
      error:(err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }
}
