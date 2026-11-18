
import { Component } from '@angular/core';
import { UserListModel } from '../Model/userlistmodel';
import { Userlist } from '../Service/userlist';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-user-view',
  imports: [CommonModule],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css',
})

export class UserView implements OnInit{

  userId!:number;
  userData:UserListModel;

  constructor(
    private userlistServ: Userlist,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef

  ){}


ngOnInit(): void {
  this.userId = Number(this.route.snapshot.paramMap.get('id'));
  this.findUser();
  this.cdr.detectChanges();
}

  findUser(){
    this.userlistServ.findUserByIdService(this.userId).subscribe({
      next:(data:UserListModel) => {
        this.userData = data;
        this.cdr.detectChanges();
      },
      error:(err) => {
        console.log(err);
      }
    });
  }

  back() {
    this.router.navigate(["/user"]);
  }
  
}
