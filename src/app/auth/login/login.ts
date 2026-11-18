import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../Service/login-service';
import { ToastrService } from 'ngx-toastr';
import { LoginRequest } from '../Model/login-request';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {


  constructor(
    private loginServ: LoginService,
    private toast: ToastrService,
    private router: Router

  ) { }

  showPassword: boolean = false;
  login: LoginRequest = {
    username: '',
    password: ''
  };

  loginComponent() {

    if (this.login.username.length == 0) {
      this.toast.error("Please enter username");
      return;
    }
    if (this.login.password.length == 0) {
      this.toast.error("Please enter password");
      return;
    }

    this.loginServ.loginService(this.login).subscribe({
      next: (data) => {
        // console.log(data);
        // console.log("Token: " + data.token);
        // Store token and role in localstorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.authorities[0].authority);

        const user = { ...data.user };
        localStorage.setItem("user", JSON.stringify(user))

        this.toast.success("Login seccessful");

        // Redirect to Dashboard
        this.router.navigate(["/dashboard"]);
      },
      error: (err) => {
        if (err.status === 400) {
          Object.values(err.error).forEach((message: any) => {
            this.toast.error(message);
          });
        } 
        else if(err.status === 0) {
          this.toast.error("Server is shutdow , Please start server then try.");
        }
        else {
          this.toast.error("Something went wrong");
          console.log(err);
        }
      }
    });

  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

}
