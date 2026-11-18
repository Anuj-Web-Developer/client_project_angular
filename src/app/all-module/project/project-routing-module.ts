import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectList } from './project-list/project-list';
import { AddProject } from './add-project/add-project';
import { ViewProject } from './view-project/view-project';

const routes: Routes = [
  
   {path: '', component: ProjectList},
   {path: 'project-list', component: ProjectList},
   {path: 'add-project', component: AddProject},
   {path: 'edit-project/:id', component: AddProject},
   {path: 'view-project/:id', component: ViewProject} 
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule { }
