import { Component } from '@angular/core';
import { ReportService } from '../Service/report-service';
import { ProjectInfo } from '../Model/project-info';
import { OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-project-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './project-report.html',
  styleUrl: './project-report.css',
})
export class ProjectReport implements OnInit {

  projectInfo: ProjectInfo[] = [];
  selectedStatus: string = '';
  from: string = '';
  to: string = '';
  isVisible: boolean = true;
  local_user: any;
  userId: number;
  role:string = null;


  constructor(
    private service: ReportService,
    private cdr: ChangeDetectorRef,
    private toast: ToastrService
  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    const loginUser = localStorage.getItem('user');
    if (!loginUser) {
      this.toast.error('User not found');
      return;
    }
      // Convert JSON string into object
      this.local_user = JSON.parse(loginUser);
      this.userId = this.local_user.id; 
  }

  filter() {

    // Username + both dates
    if (this.selectedStatus && this.from && this.to) {
      this.getFilteredProjectInfoList();
    }

    // Username only
    else if (this.selectedStatus && !this.from && !this.to) {
      this.getFilteredProjectInfoList();
    }

    // From date and To date but no username
    else if (this.from && this.to && !this.selectedStatus) {
      this.getFilteredProjectInfoList();
    }

    // Only one date selected
    else if (this.from || this.to) {
      this.toast.info("Please select both From Date and To Date");
    }

    // Nothing selected
    else {
      this.toast.info("Please select filter");
    }
  }

  getFilteredProjectInfoList() {
    this.service.getFilteredProjectInfo(this.from, this.to, this.selectedStatus).subscribe({
      next: (response) => {
        this.projectInfo = response;
        this.cdr.detectChanges();
        if (response.length == 0) {
          this.isVisible = false;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  getProjectListByUserId() {
    this.service.getProjectListByUserId(this.from, this.to, this.selectedStatus, this.userId).subscribe({
      next:(response) => {
         this.projectInfo = response;

        if (response.length == 0) {
          this.isVisible = false;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  downloadProjectExcel() {

    if (!this.projectInfo || this.projectInfo.length === 0) {
      this.toast.info('No project data available to download.');
      return;
    }

    const excelData = this.projectInfo.map((info, index) => ({
      'Sr.No': index + 1,
      'Project Name': info.projectName,
      'Customer Name': info.customer?.name ?? '',
      'Project Website': info.projectWebsite,
      'Project Start Date': info.projectStartDate,
      'Project End Date': info.projectEndDate,
      'Status': info.status
    }));

    const worksheet: XLSX.WorkSheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook: XLSX.WorkBook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Project List'
    );

    XLSX.writeFile(
      workbook,
      'Project-List.xlsx'
    );
  }

}
