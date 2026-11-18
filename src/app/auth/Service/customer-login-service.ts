import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CustomerLoginService {

  constructor(
    private http: HttpClient
  ) { }

  // url:string = "http://localhost:8184/auth/customer";

  private baseUrl = (window as any)["commonUrlApi"] + "/auth/customer";

  checkSessionService(): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/check-session`, { withCredentials: true });
  }

  sendOTPService(email: string) {
    return this.http.post(
      `${this.baseUrl}/send-otp/${email}`,
      {},
      {
        responseType: 'text',
        withCredentials: true
      }
    );
  }

  verifyOTPService(email: string, otp: number) {
    return this.http.post(
      `${this.baseUrl}/verify-otp/${email}/${otp}`,
      {},
      {
        responseType: 'text',
        withCredentials: true
      }
    );
  }

}
