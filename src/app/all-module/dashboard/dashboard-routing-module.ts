import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { AdminProfile } from './admin-profile/admin-profile';
import { ChangePassword } from './change-password/change-password';

const routes: Routes = [
  {path:'', component: Dashboard},
  {path:'dashboard', component: Dashboard},
  {path:'admin-profile', component: AdminProfile},
  {path:'change-password', component: ChangePassword}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
