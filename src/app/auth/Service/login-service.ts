import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginRequest } from '../Model/login-request';
import { Observable } from 'rxjs';
import { LoginResponse } from '../Model/login-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

     http = inject(HttpClient);

    //  url:string = "Http://localhost:8184";

      private baseUrl = window["commonUrlApi"];
  
     loginService(login:LoginRequest):Observable<LoginResponse> {
       return this.http.post<LoginResponse>(`${this.baseUrl}/api/auth/signin`,login,{});
     }
}
