import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserListModel } from '../../user/Model/userlistmodel';
import { DashboardService } from '../Service/dashboard-service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-change-password',
  imports: [FormsModule, CommonModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword {

  isVisibleNewPass: boolean = false;
  isVisibleConfirmPass: boolean = false;

  password: UserListModel = {
    password: ''
  } as UserListModel;

  confirmPassword: string = '';

  constructor(
    private toast: ToastrService,
    private service: DashboardService,
    private router: Router
  ) {}

  toggleNewPass() {
    this.isVisibleNewPass = !this.isVisibleNewPass;
  }

  toggleConfirmPass() {
    this.isVisibleConfirmPass = !this.isVisibleConfirmPass;
  }

  updatePassword() {

    // Check empty password
    if (!this.password.password) {
      this.toast.error("Please enter new password.");
      return;
    }

    // Check minimum length
    if (this.password.password.length < 6) {
      this.toast.error("Password must be at least 6 characters.");
      return;
    }

    // Check confirm password
    if (this.password.password !== this.confirmPassword) {
      this.toast.error("New password and confirm password is not same.");
      return;
    }

    // Call backend only when validation succeeds
    this.service.changePasswordService(this.password).subscribe({

      next: (response) => {
        this.toast.success(response);
        this.router.navigate(["/auth/login"]);
      },

      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }

    });
  }
}