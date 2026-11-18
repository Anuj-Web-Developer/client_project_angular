import { Component, OnInit, RESPONSE_INIT } from '@angular/core';
import { ProjectViewModel } from '../Model/project-view-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ProjectService } from '../Service/project-service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { DashboardService } from '../../dashboard/Service/dashboard-service';



@Component({
  selector: 'app-view-project',
  imports: [CommonModule, FormsModule],
  templateUrl: './view-project.html',
  styleUrl: './view-project.css',
})

export class ViewProject implements OnInit {

  project!: ProjectViewModel;
  projectId!: number;
  imageUrl = '';
  resourceUrl!: SafeResourceUrl;
  viewAttachment: boolean = false;
  role: string = '';

  constructor(
    private projectServ: ProjectService,
    private route: ActivatedRoute,
    private toast: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
   
  ) { }


  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProject();
    this.cdr.detectChanges();
    
  }


  getProject() {
    this.projectServ.getProjectService(this.projectId).subscribe({
      next: (data) => {

        this.project = data;
        // this.getAttachment(this.projectId);
        // this.prepareFile();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }


  downloadAttachment(attachmentType: string): void {

    if (!this.projectId) {
      this.toast.warning('Project not found');
      return;
    }

    this.projectServ.downloadAttachmentService(this.projectId, attachmentType).subscribe({
      next: (response: HttpResponse<Blob>) => {

        const blob = response.body;
        if (!blob) {
          this.toast.error('Empty file received');
          return;
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'attachment';

        if (contentDisposition) {
          const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/);
          if (match && match[1]) {
            fileName = decodeURIComponent(match[1]);
          }
        }

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download error:', err);
        this.toast.error('Unable to download file');
      }
    });
  }


  getHiddenPassword(password: string): string {
    return '*'.repeat(password?.length || 0);
  }


  copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success("clipboard copied successfull");
    }).catch(err => {
      this.toast.error("Copy failed", err);
    })
  }


  sendReminder() {

    if (!confirm("Are you sure to send reminder?")) {
      return;
    }

    this.projectServ.sendReminderService(this.projectId).subscribe({
      next: (response) => {
        this.toast.success(response);
      },
      error: (err) => {
        console.log(err);
        this.toast.error(err.error);
      }
    });
  }


  back() {
    this.router.navigate(["/project"]);
  }

}
