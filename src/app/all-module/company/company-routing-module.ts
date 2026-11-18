import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyProfile } from './company-profile/company-profile';
import { AddCompany } from './add-company/add-company';

const routes: Routes = [
  {path:"", component: CompanyProfile},
  {path:"add-company", component: AddCompany},
  {path:"edit-company:/id", component: AddCompany}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
