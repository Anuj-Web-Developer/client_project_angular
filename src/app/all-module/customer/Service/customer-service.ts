import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CustomerListModel } from '../Model/customer-list-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  
  constructor(
    private http: HttpClient
  ){}

  // url:string = "Http://localhost:8184/api/customer";

  private baseUrl = (window as any)["commonUrlApi"] + "/api/customer";

 saveCustomer(customer: CustomerListModel){
    return this.http.post(`${this.baseUrl}/saveCustomer`,customer,{responseType:'text'});
  }

  customerListService():Observable<CustomerListModel[]>{
    return this.http.get<CustomerListModel[]>(`${this.baseUrl}/getAllCustomers`);
  }

  getCustomerService(id:number):Observable<CustomerListModel> {
    return this.http.get<CustomerListModel>(`${this.baseUrl}/getCustomerById/${id}`);
  }

  updateCustomerService(customer: CustomerListModel) {
    return this.http.post(`${this.baseUrl}/updateCustomer`,customer,{responseType:'text'});
  }

  searchByKeywordService(keyword:string): Observable<CustomerListModel[]> {
    return this.http.get<CustomerListModel[]>(`${this.baseUrl}/findWithKeyword/${keyword}`);
  }

}


