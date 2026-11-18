import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CompanyModel } from '../Model/company-model';
import { identity, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {

  http = inject(HttpClient);

  private baseUrl = (window)["commonUrlApi"] + "/api/company-info";

  saveCompanyService(companyData: CompanyModel) {

    return this.http.post<CompanyModel>(`${this.baseUrl}/saveCompany`, companyData);
  }

  getFirstCompanyInfoService() {

    return this.http.get<CompanyModel>(`${this.baseUrl}/getCompanyInfo`);
  }


  saveFile(file: File, companyId: number, attachmentType: string): Observable<string> {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("id", companyId.toString());
    formData.append("attachmentType", attachmentType);

    return this.http.post(`${this.baseUrl}/saveFile`, formData, { responseType: 'text' });
  }


  viewAttachmentService(companyId: number, fileType: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/viewFile/${companyId}/${fileType}`, { responseType: 'blob', observe: 'response' });
  }


}
