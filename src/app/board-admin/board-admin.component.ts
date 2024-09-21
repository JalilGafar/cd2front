import { Component, OnInit } from '@angular/core';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-board-admin',
  standalone: true,
  imports: [],
  templateUrl: './board-admin.component.html',
  styleUrl: './board-admin.component.scss'
})
export class BoardAdminComponent implements OnInit{
  content!: string;

  constructor(private userservice: UserService){ }

  ngOnInit(): void {
    this.userservice.getAdminBoard().subscribe(
      data => {
        this.content = data
      },
      err =>{
        this.content = JSON.parse(err.error).message;
      }
    )
  }

}
