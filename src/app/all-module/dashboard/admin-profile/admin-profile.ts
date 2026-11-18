import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom } from '@angular/core';
import { OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.css',
})
export class AdminProfile implements OnInit{

  user:any;
  adminId:number=0;

  constructor(
    private router: Router
  ){}

  ngOnInit(): void {
    this.user =  localStorage.getItem('user');
    this.user = JSON.parse(this.user);
    this.adminId = this.user.id;
  }

  back() {
    this.router.navigate(["/dashboard"]);
  }

}
