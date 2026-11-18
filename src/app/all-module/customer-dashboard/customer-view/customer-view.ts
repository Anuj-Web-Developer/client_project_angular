import { ChangeDetectorRef, Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerDashboardService } from '../Service/customer-dashboard-service';
import { ProjectModel } from '../Model/project-model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-view',
  imports: [CommonModule],
  templateUrl: './customer-view.html',
  styleUrl: './customer-view.css',
})
export class CustomerView implements OnInit {

  projectId: number;
  projectData: ProjectModel;
  imageUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private service: CustomerDashboardService,
    private toast: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    this.getProjectById();
  }


  getProjectById() {
    this.service.getProjectByIdService(this.projectId).subscribe({
      next: (response) => {
        this.projectData = response;
        console.log("Project Data: " + this.projectData);

        if (this.projectData.fileData && this.projectData.fileType) {
          this.imageUrl =
            `data:${this.projectData.fileType};base64,${this.projectData.fileData}`;
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.toast.error("Something went wrong");
        console.log(err);
      }
    });
  }
}
