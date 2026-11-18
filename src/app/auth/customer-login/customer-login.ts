import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerLoginService } from '../Service/customer-login-service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-customer-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './customer-login.html',
  styleUrls: ['./customer-login.css']
})
export class CustomerLogin {

  email: string = '';
  otp: string = '';
  otpSent: boolean = false;
  isLoading: boolean = false;
  resendOtp: boolean = false;


  constructor(
    private service: CustomerLoginService,
    private toast: ToastrService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }


  sendOTP() {
    this.isLoading = true;
    if (!this.email) {
      this.toast.warning("Please enter email.");
      this.isLoading = false;
      return;
    }
    this.service.sendOTPService(this.email).subscribe({
      next: (response: any) => {
        this.toast.success(response);
        this.otpSent = true;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  verifyOTP() {
    if (!this.otp) {
      this.toast.warning("Please enter OTP.");
      return;
    }
    this.service.verifyOTPService(this.email, Number(this.otp)).subscribe({
      next: (response: any) => {
        this.toast.success(response);
        this.router.navigateByUrl('/customer/customer-dashboard');
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }

  // resendOTP() {
  //   this.otp = '';
  //   this.service.sendOTPService(this.email).subscribe({
  //     next: (response: any) => {
  //       this.toast.success("OTP sent successfully.");
  //       this.otpSent = true;
  //       this.isLoading = true;
  //     },
  //     error: (err) => {
  //       this.toast.error(err.error);
  //       this.isLoading = true;
  //       this.cdr.detectChanges();
  //     }
  //   });
  // }

}