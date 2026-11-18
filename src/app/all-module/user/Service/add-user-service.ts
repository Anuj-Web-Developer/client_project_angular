import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserListModel } from '../Model/userlistmodel';
import { Observable } from 'rxjs';
import { UserProjectModel } from '../Model/user-project-model';



@Injectable({
  providedIn: 'root',
})
export class AddUserService {
  constructor(
    private http: HttpClient
  ){}

  // url:string = "Http://localhost:8184";

  private baseUrl = (window)["commonUrlApi"];

  addUserService(user:UserListModel){
    return this.http.post(`${this.baseUrl}/api/auth/addProfile`,user,{responseType:'text'});  
  }

  getProjectList():Observable<UserProjectModel[]>{
    return this.http.get<UserProjectModel[]>(`${this.baseUrl}/api/project/getProjectList`);
  }
  
}
