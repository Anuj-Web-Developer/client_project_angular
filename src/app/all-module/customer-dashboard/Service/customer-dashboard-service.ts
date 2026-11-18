import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CustomerModel } from '../Model/customer-model';
import { ProjectModel } from '../Model/project-model';

@Injectable({
  providedIn: 'root',
})
export class CustomerDashboardService {
  
  private baseUrl = window["commonUrlApi"] + "/auth/customer";
  http = inject(HttpClient);

  testingMethodService() {
    return this.http.get(`${this.baseUrl}/testing`,{responseType:'text'});
  }

  getCustomerProfile():Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.baseUrl}/getProfile`);
  }

  getProjectList(customerId:number):Observable<ProjectModel[]> {
    return this.http.get<ProjectModel[]>(`${this.baseUrl}/getProjectList/${customerId}`);
  }

  logoutCustomer() {
    return this.http.post(`${this.baseUrl}/logout`,{},{responseType:'text'});
  }

  getProjectByIdService(projectId: number):Observable<ProjectModel> {
    return this.http.get<ProjectModel>(`${this.baseUrl}/getProject/${projectId}`);
  }

  getCustomerByIdService(customerId:number):Observable<CustomerModel> {
    return this.http.get<CustomerModel>(`${this.baseUrl}/getCustomerById/${customerId}`);
  }

  // ************************ UPDATE PROJECT PASSWORD **************************************

  updateProjectPasswordService(projectData:ProjectModel) {
    return this.http.post(`${this.baseUrl}/updateProject`,projectData,{responseType:'text'});
  }
}
