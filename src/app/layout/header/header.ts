import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../all-module/dashboard/Service/dashboard-service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  user:any;
  role: string = '';

  ngOnInit(): void {
     const response = localStorage.getItem('user');
     this.user = JSON.parse(response!);
     this.getRole();
  }

  @Output() sidebarToggle = new EventEmitter<void>();
  toggleSidebar(): void {
    this.sidebarToggle.emit();
  }

  constructor(
    private toast: ToastrService,
    private router: Router,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ){}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    // this.toast.success("Logout successfully");
    this.router.navigate(["/auth/login"]);
  }

  getRole() {
    this.dashboardService.getRoleService().subscribe({
      next:(response) => {
        this.role = response;
        this.cdr.detectChanges();
      },
      error:(err) => {
        console.log(err);
        this.toast.error("Something went wrong");
      }
    });
  }

}
