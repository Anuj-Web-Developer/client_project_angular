import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { ForgetPassword } from './forget-password/forget-password';
import { CustomerLogin } from './customer-login/customer-login';


const routes: Routes = [
  {
    path:'',
    component: Login
  },
  {
    path:'login',
    component: Login
  },
  {
    path:'forget-password',
    component: ForgetPassword
  },
  {
    path:'customer-login',
    component:CustomerLogin
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
