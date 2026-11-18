import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CustomerListModel } from '../Model/customer-list-model';
import { CustomerService } from '../Service/customer-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
// import * as $ from 'jquery';
import $ from 'jquery';
import 'datatables.net-bs5';
import 'datatables.net-responsive-bs5';


// declare var $: any;

@Component({
  selector: 'app-customer-list',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.css',
})
export class CustomerList implements OnInit {

  customerList: CustomerListModel[] = [];

  constructor(
    private service: CustomerService,
    private toast: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.customerListComp();
  }

  customerListComp() {
    this.service.customerListService().subscribe({
      next: (data: CustomerListModel[]) => {
        this.customerList = data;
        this.cdr.detectChanges();
        setTimeout(() => {

          $('#customerTable').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            responsive: false,
            order: [],
            columnDefs: [
              {
                targets: 2,
                type: 'string'
              }
            ],
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            language: {
              search: "Search Customer:"
            }
          });
        }, 0);

        // this.toast.success("Customer data fetched");
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }
}
