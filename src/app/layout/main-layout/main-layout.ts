import { Component } from '@angular/core';
import { Sidebar } from "../sidebar/sidebar";
import { Header } from "../header/header";
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main-layout',
  imports: [Sidebar, Header, RouterOutlet,RouterModule,CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  isSidebarOpen = false;
 
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
 
  closeSidebar(): void {
    this.isSidebarOpen = false;
  }
}
