import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainLayout } from '../layout/main-layout/main-layout';

const routes: Routes = [
  {
    path: 'customer-dashboard', loadChildren: () => import('./customer-dashboard/customer-dashboard-module').then(m => m.CustomerDashboardModule)
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard-module').then((m) => m.DashboardModule),
      },

      {
        path: 'user',
        loadChildren: () => import('./user/user-module').then((m) => m.UserModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('./customer/customer-module').then(m => m.CustomerModule)
      },
      {
        path: 'project',
        loadChildren: () => import('./project/project-module').then(m => m.ProjectModule)
      },
      {
        path:'report',
        loadChildren: () => import('./report/report-module').then(m => m.ReportModule)
      },
      {
        path:'company',
        loadChildren: () => import('./company/company-module').then(m => m.CompanyModule)
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllModuleRoutingModule { }