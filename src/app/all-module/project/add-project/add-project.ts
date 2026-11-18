// import { CommonModule } from '@angular/common';
// import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { CustomerListModel } from '../../customer/Model/customer-list-model';
// import { ProjectViewModel } from '../Model/project-view-model';
// import { CustomerService } from '../../customer/Service/customer-service';
// import { ProjectService } from '../Service/project-service';
// import Swal from 'sweetalert2';
// import { ProjectListModel } from '../Model/project-list-model';
// import { forkJoin, Observable, of } from 'rxjs';




// @Component({
//   selector: 'app-add-project',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterLink],
//   templateUrl: './add-project.html',
//   styleUrl: './add-project.css'
// })

// export class AddProject implements OnInit {

//   keyword: string = '';
//   customerList: CustomerListModel[] = [];
//   selectedCustomer?: CustomerListModel;
//   projectId: number = 0;
//   showProjectPassword = false;
//   showServerPassword = false;
//   sendEmail: boolean = false;
//   projectError: ProjectViewModel;

//   projectData: ProjectViewModel = {
//     id: null,
//     projectName: '',
//     projectWebsite: '',
//     loginUrl: '',
//     username: '',
//     password: '',
//     serverUrl: '',
//     serverUsername: '',
//     serverPassword: '',
//     socialMedia: '',
//     projectStartDate: '',
//     projectEndDate: '',
//     status: 'ACTIVE',
//     description: '',
//     customer: {} as CustomerListModel,
//     isSendEmail: false,
//   };
//   backendErrors: { [key: string]: string } = {};

//   loginAttachment: File;
//   serverAttachment1: File;
//   serverAttachment2: File;


//   constructor(
//     private customerServ: CustomerService,
//     private toast: ToastrService,
//     private projectServ: ProjectService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) { }


//   ngOnInit(): void {

//     this.projectId = Number(this.route.snapshot.paramMap.get('id'));
//     if (this.projectId > 0) {
//       this.getProject();
//     }

//     if (this.projectId === 0) {
//       const localData = localStorage.getItem('user');
//       const parseUser = JSON.parse(localData);
//       if (!parseUser.isAllowedCreateProject) {
//         this.toast.error("You can't add new Project.");
//       }
//     }
//   }


//   searchName() {
//     if (!this.keyword || this.keyword.trim().length < 2) {
//       this.customerList = [];
//       return;
//     }
//     this.customerServ.searchByKeywordService(this.keyword).subscribe({
//       next: (data) => {
//         this.customerList = data;
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.log(err);
//         this.toast.error("Unable to search customer");
//       }
//     });
//   }

//   selectCustomer(customer: CustomerListModel) {
//     this.selectedCustomer = customer;
//     this.keyword = customer.name;
//     this.customerList = [];
//   }


//   async saveProject() {
//     if (!this.selectedCustomer) {
//       this.toast.warning("Please select customer");
//       return;
//     }

//     // ***********************  If Server URL exists then server username and server password required **********************************
//     // if ((this.projectData.serverUrl?.length ?? 0) > 0) {
//     //   if ((this.projectData.serverUsername?.length ?? 0) === 0 || (this.projectData.serverPassword?.length ?? 0) === 0) {
//     //     this.toast.error("Without server's username && password url won't be save.");
//     //     return;
//     //   }
//     // } else if (((this.projectData.serverUrl?.length ?? 0) === 0) && ((this.projectData.serverUsername?.length ?? 0) !== 0 || (this.projectData.serverPassword?.length ?? 0) !== 0)) {

//     //   this.toast.error("If you want to save server's username & password then server url is required.");
//     //   return;
//     // }

//     this.projectData.customer = this.selectedCustomer;

//     // ***************** Re-Verify to send email notification ***************************
//     if (this.projectData.isSendEmail) {
//       const result = await this.isSendEmail();
//       if (result.isConfirmed) {
//         // continue;
//       } else {
//         this.projectData.isSendEmail = false;
//       }
//     }

//     // *********************** Save Project *********************************
//     this.persistProject();
//   }


//   // persistProject() {
//   //   this.projectServ.saveProjectService(this.projectData).subscribe({
//   //     next: (response: ProjectListModel) => {

//   //       const id = response.id;
//   //       alert("Project Id: "+id);
//   //       console.log("Project Id is: " + id);
//   //       if (this.loginAttachment) {
//   //         this.saveFile(this.loginAttachment, id, "loginAttachment");
//   //       }
//   //       if (this.serverAttachment1) {
//   //         this.saveFile(this.serverAttachment1, id, "serverAttachment1");
//   //       }
//   //       if (this.serverAttachment2) {
//   //         this.saveFile(this.serverAttachment2, id, "serverAttachment2");
//   //       }

//   //       this.toast.success("Project Added Successfully");

//   //       this.router.navigate(['/project']);
//   //     },
//   //     error: (err) => {

//   //       if (err.status === 400) {

//   //         this.backendErrors = JSON.parse(err.error);
//   //         console.log('backendErrors:', this.backendErrors);

//   //         this.cdr.detectChanges();
//   //       } else if (err.status === 403) {
//   //         console.log(err);
//   //         this.toast.error(err.error);
//   //       }
//   //     }
//   //   });
//   // }


//   persistProject() {

//     this.projectServ.saveProjectService(this.projectData).subscribe({

//       next: (response: ProjectListModel) => {

//         this.projectId = response.id;

//         const uploadRequests = [];

//         if (this.loginAttachment) {

//           uploadRequests.push(
//             this.saveFile(
//               this.loginAttachment,
//               this.projectId,
//               'loginAttachment'
//             )
//           );
//         }

//         if (this.serverAttachment1) {

//           uploadRequests.push(
//             this.saveFile(
//               this.serverAttachment1,
//               this.projectId,
//               'serverAttachment1'
//             )
//           );
//         }

//         if (this.serverAttachment2) {
//           uploadRequests.push(
//             this.saveFile(
//               this.serverAttachment2,
//               this.projectId,
//               'serverAttachment2'
//             )
//           );
//         }
//         // No attachment selected
//         if (uploadRequests.length === 0) {

//           this.toast.success('Project Added Successfully');

//           this.router.navigate(['/project']);

//           return;
//         }

//         // Wait for ALL uploads
//         forkJoin(uploadRequests).subscribe({

//           next: (responses) => {

//             console.log('All attachments uploaded:', responses);

//             this.toast.success(
//               'Project and attachments added successfully'
//             );

//             this.router.navigate(['/project']);
//           },

//           error: (err) => {

//             console.error('Attachment upload failed:', err);

//             this.toast.error(
//               'Project saved, but attachment upload failed'
//             );
//           }

//         });

//       },

//       error: (err) => {

//         if (err.status === 400) {

//           // Don't blindly JSON.parse() here
//           if (typeof err.error === 'string') {
//             try {
//               this.backendErrors = JSON.parse(err.error);
//             } catch {
//               this.backendErrors = err.error;
//             }
//           } else {
//             this.backendErrors = err.error;
//           }

//           console.log('backendErrors:', this.backendErrors);

//           this.cdr.detectChanges();

//         } else if (err.status === 403) {

//           console.log(err);

//           this.toast.error(err.error);
//         }
//       }

//     });
//   }


//   getProject() {
//     this.projectServ.getProjectService(this.projectId).subscribe({
//       next: (data) => {
//         this.projectData = data;
//         if (data.customer) {
//           this.selectedCustomer = data.customer;
//           this.keyword = data.customer.name;
//         }
//         this.cdr.detectChanges();
//       },
//       error: (err) => {
//         console.log(err);
//         this.toast.error("Unable to load project");
//       }
//     });
//   }


//   async editProject() {
//     if (this.selectedCustomer) {
//       this.projectData.customer = this.selectedCustomer;
//     }

//     // ***********************  If Server URL exists then server username and server password required **********************************
//     if ((this.projectData.serverUrl?.length ?? 0) > 0) {
//       if ((this.projectData.serverUsername?.length ?? 0) === 0 || (this.projectData.serverPassword?.length ?? 0) === 0) {
//         this.toast.error("Without server's username && password url won't be save.");
//         return;
//       }
//     } else if (((this.projectData.serverUrl?.length ?? 0) === 0) && ((this.projectData.serverUsername?.length ?? 0) !== 0 || (this.projectData.serverPassword?.length ?? 0) !== 0)) {

//       this.toast.error("If you want to save server's username & password then server url is required.");
//       return;
//     }

//     // ***************** Re-Verify to send email notification ***************************
//     if (this.projectData.isSendEmail) {
//       const result = await this.isSendEmail();
//       if (result.isConfirmed) {
//         // continue;
//       } else {
//         this.projectData.isSendEmail = false;
//       }
//     }

//     // ******************** Save Attachment ********************************
//     this.updateProjectData();
//   }


//   updateProjectData() {

//     this.projectServ.updateProject(this.projectData).subscribe({
//       next: (res: ProjectListModel) => {
//         console.log(res);
//         this.toast.success("Project Updated Successfully");
//         const id = res.id;

//         if (this.loginAttachment) {
//           this.saveFile(this.loginAttachment, id, "loginAttachment");
//         }
//         if (this.serverAttachment1) {
//           this.saveFile(this.serverAttachment1, id, "serverAttachment1");
//         }
//         if (this.serverAttachment2) {
//           this.saveFile(this.serverAttachment2, id, "serverAttachment2");
//         }

//         this.router.navigate(['/project']);
//       },
//       error: (err) => {
//         if (err.status === 400) {
//           this.backendErrors = JSON.parse(err.error);
//           console.log('backendErrors:', this.backendErrors);
//           this.cdr.detectChanges();
//         }
//       }
//     });
//   }


//   // newSeperateFile() {
//   //   if (this.selectedFile) {
//   //     this.projectServ.saveAttachmentService(this.selectedFile).subscribe({
//   //       next: (response) => {
//   //         this.attachment = response;
//   //         this.toast.success("File saved successfully");
//   //       },
//   //       error: (err) => {
//   //         this.toast.error(err.error);
//   //         console.log(err);
//   //       }
//   //     });
//   //   }
//   // }


//   async isSendEmail() {

//     const result = await Swal.fire({
//       title: 'Are you sure?',
//       text: 'You want to send email?',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Yes, Send',
//       cancelButtonText: 'Cancel',
//       confirmButtonColor: '#dc3545',
//       cancelButtonColor: '#6c757d',
//       reverseButtons: true
//     });
//     return result;
//   }


//   saveFile(
//     attachment: File,
//     id: number,
//     attachmentType: string
//   ): Observable<any> {

//     return this.projectServ.saveAttachmentService(
//       attachment,
//       id,
//       attachmentType
//     );
//   }


//   onLoginAttachmentSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.loginAttachment = input.files[0];
//     }
//   }

//   onServer1AttachmentSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.serverAttachment1 = input.files[0];
//     }
//   }

//   onServer2AttachmentSelected(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.serverAttachment2 = input.files[0];
//     }
//   }

// }
























import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomerListModel } from '../../customer/Model/customer-list-model';
import { ProjectViewModel } from '../Model/project-view-model';
import { CustomerService } from '../../customer/Service/customer-service';
import { ProjectService } from '../Service/project-service';
import Swal from 'sweetalert2';
import { ProjectListModel } from '../Model/project-list-model';
import { from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, toArray } from 'rxjs/operators';

interface UploadResult {
  type: string;
  success: boolean;
}

@Component({
  selector: 'app-add-project',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-project.html',
  styleUrl: './add-project.css'
})
export class AddProject implements OnInit {

  keyword: string = '';
  customerList: CustomerListModel[] = [];
  selectedCustomer?: CustomerListModel;
  projectId: number = 0;
  showProjectPassword = false;
  showServerPassword = false;
  sendEmail: boolean = false;
  projectError: ProjectViewModel;

  projectData: ProjectViewModel = {
    id: null,
    projectName: '',
    projectWebsite: '',
    loginUrl: '',
    username: '',
    password: '',
    serverUrl: '',
    serverUsername: '',
    serverPassword: '',
    socialMedia: '',
    projectStartDate: '',
    projectEndDate: '',
    status: 'ACTIVE',
    description: '',
    customer: {} as CustomerListModel,
    isSendEmail: false,
  };
  backendErrors: { [key: string]: string } = {};

  loginAttachment: File;
  serverAttachment1: File;
  serverAttachment2: File;

  constructor(
    private customerServ: CustomerService,
    private toast: ToastrService,
    private projectServ: ProjectService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.projectId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.projectId > 0) {
      this.getProject();
    }

    if (this.projectId === 0) {
      const localData = localStorage.getItem('user');
      const parseUser = JSON.parse(localData);
      if (!parseUser.isAllowedCreateProject) {
        this.toast.error("You can't add new Project.");
      }
    }
  }

  searchName() {
    if (!this.keyword || this.keyword.trim().length < 2) {
      this.customerList = [];
      return;
    }
    this.customerServ.searchByKeywordService(this.keyword).subscribe({
      next: (data) => {
        this.customerList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error("Unable to search customer");
      }
    });
  }

  selectCustomer(customer: CustomerListModel) {
    this.selectedCustomer = customer;
    this.keyword = customer.name;
    this.customerList = [];
  }

  // ======================= ADD =======================

  async saveProject() {
    if (!this.selectedCustomer) {
      this.toast.warning("Please select customer");
      return;
    }

    this.projectData.customer = this.selectedCustomer;

    if (this.projectData.isSendEmail) {
      const result = await this.isSendEmail();
      if (!result.isConfirmed) {
        this.projectData.isSendEmail = false;
      }
    }

    this.persistProject();
  }

  persistProject() {
    this.projectServ.saveProjectService(this.projectData).subscribe({
      next: (response: ProjectListModel) => {
        this.projectId = response.id;

        this.uploadAttachments(this.projectId).subscribe(results => {
          this.showUploadResult(results, 'Project Added Successfully');
          this.router.navigate(['/project']);
        });
      },
      error: (err) => this.handleSaveError(err)
    });
  }

  // ======================= EDIT =======================

  getProject() {
    this.projectServ.getProjectService(this.projectId).subscribe({
      next: (data) => {
        this.projectData = data;
        if (data.customer) {
          this.selectedCustomer = data.customer;
          this.keyword = data.customer.name;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log(err);
        this.toast.error("Unable to load project");
      }
    });
  }

  async editProject() {
    if (this.selectedCustomer) {
      this.projectData.customer = this.selectedCustomer;
    }

    // If Server URL exists then server username and server password required
    if ((this.projectData.serverUrl?.length ?? 0) > 0) {
      if ((this.projectData.serverUsername?.length ?? 0) === 0 || (this.projectData.serverPassword?.length ?? 0) === 0) {
        this.toast.error("Without server's username && password url won't be save.");
        return;
      }
    } else if (
      (this.projectData.serverUrl?.length ?? 0) === 0 &&
      ((this.projectData.serverUsername?.length ?? 0) !== 0 || (this.projectData.serverPassword?.length ?? 0) !== 0)
    ) {
      this.toast.error("If you want to save server's username & password then server url is required.");
      return;
    }

    if (this.projectData.isSendEmail) {
      const result = await this.isSendEmail();
      if (!result.isConfirmed) {
        this.projectData.isSendEmail = false;
      }
    }

    this.updateProjectData();
  }

  updateProjectData() {
    this.projectServ.updateProject(this.projectData).subscribe({
      next: (res: ProjectListModel) => {
        this.uploadAttachments(res.id).subscribe(results => {
          this.showUploadResult(results, 'Project Updated Successfully');
          this.router.navigate(['/project']);
        });
      },
      error: (err) => this.handleSaveError(err)
    });
  }

  // ======================= ATTACHMENTS =======================

  /**
   * Uploads every selected attachment ONE BY ONE (sequential).
   * - Works for any combination: only 1, only 2, 1+2, 2+3, 1+3, all 3, none.
   * - If one upload fails, the others still continue.
   * - Always subscribed by the caller, so requests are really sent.
   */
  private uploadAttachments(id: number): Observable<UploadResult[]> {
    const files = [
      { file: this.loginAttachment, type: 'loginAttachment' },
      { file: this.serverAttachment1, type: 'serverAttachment1' },
      { file: this.serverAttachment2, type: 'serverAttachment2' },
    ].filter(item => !!item.file);

    if (files.length === 0) {
      return of([]);
    }

    return from(files).pipe(
      concatMap(item =>
        this.saveFile(item.file, id, item.type).pipe(
          map((): UploadResult => ({ type: item.type, success: true })),
          catchError(err => {
            console.error(`Upload failed for ${item.type}:`, err);
            return of<UploadResult>({ type: item.type, success: false });
          })
        )
      ),
      toArray()
    );
  }

  private showUploadResult(results: UploadResult[], successMessage: string) {
    const failed = results.filter(r => !r.success).map(r => r.type);
    if (failed.length === 0) {
      this.toast.success(successMessage);
    } else {
      this.toast.error(`Project saved, but these attachments failed: ${failed.join(', ')}`);
    }
  }

  saveFile(attachment: File, id: number, attachmentType: string): Observable<any> {
    return this.projectServ.saveAttachmentService(attachment, id, attachmentType);
  }

  onLoginAttachmentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.loginAttachment = input.files[0];
    }
  }

  onServer1AttachmentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.serverAttachment1 = input.files[0];
    }
  }

  onServer2AttachmentSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.serverAttachment2 = input.files[0];
    }
  }

  // ======================= HELPERS =======================

  private handleSaveError(err: any) {
    if (err.status === 400) {
      if (typeof err.error === 'string') {
        try {
          this.backendErrors = JSON.parse(err.error);
        } catch {
          this.backendErrors = { error: err.error };
        }
      } else {
        this.backendErrors = err.error;
      }
      this.cdr.detectChanges();
    } else if (err.status === 403) {
      this.toast.error(typeof err.error === 'string' ? err.error : 'Not allowed');
    } else {
      this.toast.error('Something went wrong');
    }
  }

  async isSendEmail() {
    return await Swal.fire({
      title: 'Are you sure?',
      text: 'You want to send email?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Send',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    });
  }
}