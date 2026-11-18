import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginInfo } from '../Model/login-info';
import { HttpParams } from '@angular/common/http';
import { ProjectInfo } from '../Model/project-info';
import { UserNameList } from '../Model/user-name-list';

@Injectable({
  providedIn: 'root',
})
export class ReportService {

  private commonUrl = window["commonUrlApi"];


  constructor(
    private http: HttpClient
  ) { }

  getListOfUserService():Observable<UserNameList | UserNameList[]> {
    return this.http.get<UserNameList | UserNameList[]>(`${this.commonUrl}/api/auth/listOfName`);
  }
  // getLoginInfo(): Observable<LoginInfo[]> {
  //   return this.http.get<LoginInfo[]>(`${this.commonUrl}/api/auth/loginLogs`);
  // }

  getFilteredLoginInfo(
    name: string,
    from: string,
    to: string
  ): Observable<LoginInfo[]> {
    let params = new HttpParams();
    if (name) {
      name = name.trim();
      params = params.set('name', name);
    }
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }
    return this.http.get<LoginInfo[]>(
      `${this.commonUrl}/api/auth/filteredLogs`,
      { params: params }
    );
  }


  // getProjectInfo():Observable<ProjectInfo[]> {
  //   return this.http.get<ProjectInfo[]>(`${this.commonUrl}/api/project/getProjectInfo`);
  // }


  getFilteredProjectInfo(from:string, to:string, stutus:string):Observable<ProjectInfo[]> {

    let params = new HttpParams();

    if(stutus){
      stutus = stutus.trim();
      params = params.set('status', stutus);
    }
    if(from) {
      params = params.set('from',from);
    }
    if(to) {
      params = params.set('to', to);
    }
    return this.http.get<ProjectInfo[]>(`${this.commonUrl}/api/project/getFilteredProjectInfo`,{params:params});
  }


  getProjectListByUserId(from:string, to:string, stutus:string, userId:number):Observable<ProjectInfo[]> {

    let params = new HttpParams();

    if(stutus){
      stutus = stutus.trim();
      params = params.set('status', stutus);
    }
    if(from) {
      params = params.set('from',from);
    }
    if(to) {
      params = params.set('to', to);
    }
    if(userId){
      params = params.set('userId', userId);
    }

    return this.http.get<ProjectInfo[]>(`${this.commonUrl}/api/auth/filteredProjects`,{params: params});
  }

}
