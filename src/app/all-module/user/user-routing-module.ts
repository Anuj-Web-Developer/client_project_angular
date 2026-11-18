import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserList } from './user-list/user-list';
import { UserAdd } from './user-add/user-add';
import { UserView } from './user-view/user-view';

const routes: Routes = [
  {path:'',component:UserList},
  {path:"add-User",component:UserAdd},
  {path:"add-User/:id",component:UserAdd},
  {path:"view-user/:id", component: UserView},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
