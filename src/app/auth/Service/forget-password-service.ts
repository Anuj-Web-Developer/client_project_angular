import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ForgetPasswordModel } from '../Model/forget-password-model';


@Injectable({
  providedIn: 'root',
})
export class ForgetPasswordService {

  constructor(
    private http: HttpClient
  ) { }

  // url:string = "Http://localhost:8184";

  private baseUrl = (window as any)["commonUrlApi"];


  sendOtpService(email: string) {
    return this.http.get(`${this.baseUrl}/api/auth/sendUserOTP/${email}`, { responseType: 'text' });
  }

  verifyOtpService(email: string, otp: string) {
    return this.http.get(`${this.baseUrl}/otp/verifyOtp/${email}/${otp}`, { responseType: 'text' });
  }

  changePasswordService(email: string, user: ForgetPasswordModel) {
    return this.http.post(`${this.baseUrl}/api/auth/changePassword/${email}`,user, { responseType: 'text' });
  }
  
}
