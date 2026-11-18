import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserListModel } from '../Model/userlistmodel';

@Injectable({
  providedIn: 'root',
})
export class Userlist {
  
  // url:string = `Http://localhost:8184`;

    private baseUrl = (window as any)["commonUrlApi"];


  constructor(private http:HttpClient){}

  userListService():Observable<UserListModel[]> {
    return this.http.get<UserListModel[]>(`${this.baseUrl}/api/auth/userList`);
  }


  findUserService(id:number): Observable<UserListModel> {
    return this.http.get<UserListModel>(`${this.baseUrl}/api/auth/getById/${id}`);
  }

  findUserByIdService(id:number): Observable<UserListModel> {
    return this.http.get<UserListModel>(`${this.baseUrl}/api/auth/getById/${id}`);
  }

  editUserService(user:UserListModel) {
    console.log("User Permission 2: "+user.isAllowedCreateProject);
    return this.http.post(`${this.baseUrl}/api/auth/updateUser`,user,{responseType:'text'});
  }
}
