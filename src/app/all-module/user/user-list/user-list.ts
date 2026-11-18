import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserListModel } from '../Model/userlistmodel';
import { Userlist } from '../Service/userlist';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

// declare var $: any;

@Component({
  selector: 'app-user-list',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList {

  userList: UserListModel[] = [];

  constructor(
    private userListServ: Userlist,
    private toast: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.userListCom();
    this.cdr.detectChanges();
  }

  userListCom() {

    this.userListServ.userListService().subscribe({
      next: (data) => {
        console.log(UserList)
        this.userList = data;
        this.cdr.detectChanges();
        // console.log(this.userList);
        setTimeout(() => {

          if ($.fn.DataTable.isDataTable('#userTable')) {
            $('#userTable').DataTable().destroy();
          }

          $('#userTable').DataTable({

            pageLength: 10,
            lengthMenu: [
              [5, 10, 25, 50],
              [5, 10, 25, 50]
            ],
            searching: true,
            ordering: true,
            paging: true,
            info: true,
            responsive: false,
            order: [],
            columnDefs: [
              {
                targets: 2,
                type: 'string'
              }
            ]
          });

        }, 0);

        // this.toast.success('User list loaded successfully');
      },
      error: (err: any) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

}
