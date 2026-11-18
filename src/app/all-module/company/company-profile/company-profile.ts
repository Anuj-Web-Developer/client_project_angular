import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, OnDestroy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompanyService } from '../Service/company-service';
import { ToastrService } from 'ngx-toastr';
import { CompanyModel } from '../Model/company-model';
import { DashboardService } from '../../dashboard/Service/dashboard-service';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-company-profile',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './company-profile.html',
  styleUrl: './company-profile.css',
})
export class CompanyProfile implements OnInit, OnDestroy {


  companyData: CompanyModel = {

    userName: '',
    mobile: '',
    email: '',
    designation: '',
    companyName: '',
    companyAddress: '',
    billingAddress: '',
    gstno: '',
    companyPhone: '',
    website: '',

  }
  logoId: number = 0;
  signatureId: number = 0;

  // logoUrl?: string;
  // signatureUrl?: string;

  logoUrl = signal<string | null>(null);
  signatureUrl = signal<string | null>(null);

  role: string | null = null;

  ngOnInit(): void {
    this.getRole();
    this.getCompany();
  }

  constructor(
    private companyService: CompanyService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef,
    private dashboardServ: DashboardService
  ) { }

  // ************************* Get Company Data ***************************************
  getCompany() {

    this.companyService.getFirstCompanyInfoService().subscribe({
      next: (response) => {
        this.companyData = response;

        this.getFile(response.id, "logoName");
        this.getFile(response.id, "singnatureName");

        // this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }


  // ************************* Get File ***************************************
  // getFile(companyId: number, attachmentType: string) {

  //   this.companyService.viewAttachmentService(companyId, attachmentType).subscribe({
  //     next: (response: HttpResponse<Blob>) => {
  //       const blob = response.body;
  //       if (!blob) {
  //         this.toast.error('Empty file received');
  //         return;
  //       }

  //       const url = window.URL.createObjectURL(blob);

  //       if (attachmentType === 'logoName') {
  //         if (this.logoUrl) {
  //           window.URL.revokeObjectURL(this.logoUrl);
  //         }
  //         this.logoUrl = url;
  //         console.log(this.logoUrl);
  //       }

  //       if (attachmentType === 'singnatureName') {
  //         if (this.signatureUrl) {
  //           window.URL.revokeObjectURL(this.signatureUrl);
  //         }
  //         this.signatureUrl = url;
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Fetch error:', err);
  //       this.toast.error('Unable to load file');
  //     }
  //   });
  // }

  getFile(companyId: number, attachmentType: string) {
    this.companyService.viewAttachmentService(companyId, attachmentType).subscribe({
      next: (response) => {
        const blob = response.body;
        if (!blob) {
          this.toast.error('Empty file received');
          return;
        }

        const url = URL.createObjectURL(blob);

        if (attachmentType === 'logoName') {
          const old = this.logoUrl();
          if (old) URL.revokeObjectURL(old);
          this.logoUrl.set(url);
        } else if (attachmentType === 'singnatureName') {
          const old = this.signatureUrl();
          if (old) URL.revokeObjectURL(old);
          this.signatureUrl.set(url);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Fetch error:', err);
        this.toast.error('Unable to load file');
      }
    });
  }


  // ************************* Cleanup ***************************************
  ngOnDestroy(): void {
    const logo = this.logoUrl();
    const signature = this.signatureUrl();

    if (logo) URL.revokeObjectURL(logo);
    if (signature) URL.revokeObjectURL(signature);
  }


  // ***************************** Get Role **************************************************
  getRole() {
    this.dashboardServ.getRoleService().subscribe({
      next: (response) => {
        this.role = response;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }

}
