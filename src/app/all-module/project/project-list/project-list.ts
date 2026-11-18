import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectListModel } from '../Model/project-list-model';
import { ProjectService } from '../Service/project-service';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import $ from 'jquery';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import { ProjectViewModel } from '../Model/project-view-model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-project-list',
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './project-list.html',
  styleUrl: './project-list.css',
})
export class ProjectList implements OnInit {

  projectList: ProjectViewModel[] = [{
    id: null,
    projectName: '',
    projectWebsite: '',

    loginUrl: '',
    username: '',
    password: '',

    serverUrl: '',
    serverUsername: '',
    serverPassword: '',

    socialMedia: '',

    projectStartDate: '',
    projectEndDate: '',
    status: null,
    description: '',

    customer: {
      id: 0,
      name: '',
      email: '',
      contact: '',
      address: '',
      billingAddress: '',
      companyName: '',
      gstNo: '',
      status: null,
      password: '',
    }
  }];

  result:any;


  constructor(
    private projectServ: ProjectService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getProjectList();
    this.cdr.detectChanges();
  }

  getProjectList() {
    this.projectServ.getProjectListService().subscribe({
      next: (data) => {
        this.projectList = data;
        this.cdr.detectChanges();
        setTimeout(() => {
          $('#projectTable').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            responsive: false,
            order: [],
            pageLength: 10,
            lengthMenu: [5, 10, 25, 50, 100],
            language: {
              search: "Search Project:"
            }
          });
        }, 0);
      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }


   sendReminder(projectId:number) {
    this.isSendEmail();
    if (!this.result.isConfirmed) {
      return;
    }

    this.projectServ.sendReminderService(projectId).subscribe({
      next: (response) => {
        this.toast.success(response);
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }


   async isSendEmail() {
  
      this.result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to send email?',
        icon: 'warning',
  
        showCancelButton: true,
  
        confirmButtonText: 'Yes, Send',
        cancelButtonText: 'Cancel',
  
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
  
        reverseButtons: true
      });
    }

}
