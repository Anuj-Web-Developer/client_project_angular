import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnInit } from '@angular/core';
import { DashboardService } from '../../all-module/dashboard/Service/dashboard-service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{

  // role:string = null;
  backendRole:string = '';

  constructor(
    private toast: ToastrService,
    private router: Router,
    private service: DashboardService,
    private cdr: ChangeDetectorRef
  ){}

  ngOnInit(): void {
    // this.role = localStorage.getItem('role');
    this.getRole();

  }

 @Input() isOpen = false;

 getRole() {
  this.service.getRoleService().subscribe({
    next:(reponse) => {
      this.backendRole = reponse;
      this.cdr.detectChanges();
    },
    error:(err) => {
      console.log(err);
      this.toast.error(err.error);
    }
  });
 }

 logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    // this.toast.success("Logout successfully");
    this.router.navigate(["/auth/login"]);
  }
}
