import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerList } from './customer-list/customer-list';
import { AddCustomer } from './add-customer/add-customer';
import { ViewCustomer } from './view-customer/view-customer';

const routes: Routes = [
  {path:'', component: CustomerList},
  {path:'customer-list', component: CustomerList},
  {path:'add-customer', component: AddCustomer},
  {path:'add-customer/:id', component: AddCustomer},
  {path:'view-customer/:id', component: ViewCustomer}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
