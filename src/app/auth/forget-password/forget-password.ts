import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ForgetPasswordService } from '../Service/forget-password-service';
import { ForgetPasswordModel } from '../Model/forget-password-model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, FormsModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.css',
})
export class ForgetPassword {

  constructor(
    private router: Router,
    private toast: ToastrService,
    private service: ForgetPasswordService,
    private cdr: ChangeDetectorRef
  ) { }

  email!: string;
  otp!: string;
  sendOTPActive: boolean = true;
  verifyOTPActive: boolean = false;
  verifyPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  newPassword:string = '';
  user: ForgetPasswordModel = {
    password: ''
  }


  sendOTP() {
    
    this.service.sendOtpService(this.email).subscribe({
      next: (data) => {
        this.toast.success(data);
        this.sendOTPActive = false;
        this.verifyOTPActive = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }

  verifyOtp() {
    this.service.verifyOtpService(this.email, this.otp).subscribe({
      next: (data) => {
        this.toast.success(data);
        this.verifyOTPActive = false;
        this.verifyPassword = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }

  changePassword() {

    if(this.user.password !== this.newPassword) {
      this.toast.error("New password and confirm password is not same.");
      return;
    }

    this.service.changePasswordService(this.email, this.user).subscribe({
      next: (data) => {
        this.toast.success("Password Change Successfully");
        this.router.navigate(["/auth/login"]);
      },
      error: (err) => {
        this.toast.error(err.error);
        console.log(err);
      }
    });
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
