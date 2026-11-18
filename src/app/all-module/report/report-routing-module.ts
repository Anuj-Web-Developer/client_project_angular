import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginHistory } from './login-history/login-history';
import { ProjectReport } from './project-report/project-report';

const routes: Routes = [
  {path:'login-history', component: LoginHistory},
  {path:'project-report', component: ProjectReport}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
