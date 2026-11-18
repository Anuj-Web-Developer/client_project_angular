import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListModel } from '../../user/Model/userlistmodel';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  // url: string = 'Http://localhost:8184';

  private baseUrl = (window as any)["commonUrlApi"];

  countUserService(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/auth/countUser`);
  }

  countCustomerService(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/customer/countCustomer`);
  }

  countProjectService(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/api/project/countProject`);
  }

  getRoleService(): Observable<string> {
    return this.http.get(`${this.baseUrl}/api/auth/getRole`, {
      responseType: 'text'
    });
  }

  changePasswordService(user:UserListModel) {
    return this.http.post(`${this.baseUrl}/api/auth/updatePassword`,user,{responseType:'text'});
  }

}
