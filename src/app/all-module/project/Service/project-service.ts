import { Injectable } from '@angular/core';
import { ProjectViewModel } from '../Model/project-view-model';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectListModel } from '../Model/project-list-model';




@Injectable({
  providedIn: 'root',
})
export class ProjectService {


  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = (window)["commonUrlApi"] + "/api/project";

  saveProjectService(projectData: ProjectViewModel) {
    return this.http.post<ProjectListModel>(`${this.baseUrl}/saveProject`, projectData);
  }

  getProjectListService(): Observable<ProjectViewModel[]> {
    return this.http.get<ProjectViewModel[]>(`${this.baseUrl}/getProjectList`);
  }

  getProjectService(id: number): Observable<ProjectViewModel> {
    return this.http.get<ProjectViewModel>(`${this.baseUrl}/getProject/${id}`);
  }


  updateProject(projectData: ProjectViewModel) {
    return this.http.post<ProjectListModel>(`${this.baseUrl}/updateProject`, projectData,);
  }


  findByCustomerId(id: number): Observable<ProjectViewModel[]> {
    return this.http.get<ProjectViewModel[]>(`${this.baseUrl}/findByCustomerId/${id}`);
  }

  //******************************* Project Attachment Service Methods*******************************//


  saveAttachmentService(
    attachment: File,
    projectId: number,
    attachmentType: string) {
     
    const formData = new FormData();
    formData.append('file', attachment);
    formData.append('projectId', projectId.toString());
    formData.append("attachmentType", attachmentType);

    return this.http.post(`${this.baseUrl}/saveFile`, formData, { responseType: "text" });
  }


  downloadAttachmentService(attachmentId: number, attachmentType: string): Observable<HttpResponse<Blob>> {
    return this.http.get(`${this.baseUrl}/download/${attachmentId}/${attachmentType}`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  // *************************** SEND REMINDER *****************************************
  sendReminderService(projectId: number) {
    return this.http.post(`${this.baseUrl}/sendReminder/${projectId}`, {}, { responseType: 'text' })
  }

}


