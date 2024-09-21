import { Component, OnInit } from '@angular/core';
import { tokenStorageService } from '../service/token-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  currentUser : any;
  constructor(private tokenStorage: tokenStorageService) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorage.getUser();
  }

}
