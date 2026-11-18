import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDashboardComponent } from './customer-dashboard-component/customer-dashboard-component';
import { CustomerView } from './customer-view/customer-view';
import { CustomerLogin } from '../../auth/customer-login/customer-login';
import { CustomerProfile } from './customer-profile/customer-profile';

const routes: Routes = [
  {path:'', component: CustomerDashboardComponent},
  {path:'customer-view/:id', component: CustomerView},
  {path:'customer-profile/:id', component: CustomerProfile}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerDashboardRoutingModule {}
