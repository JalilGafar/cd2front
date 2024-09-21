import { Component, OnInit } from '@angular/core';
import { tokenStorageService } from '../../../service/token-storage.service';
import { CommonModule } from '@angular/common';
import { ListCampusComponent } from '../list-campus/list-campus.component';
import { ListDiplomeComponent } from '../list-diplome/list-diplome.component';
import { ListEcoleComponent } from '../list-ecole/list-ecole.component';
import { ListFormationComponent } from '../list-formation/list-formation.component';
import { ListUnivComponent } from '../list-univ/list-univ.component';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-admin-start',
  standalone: true,
  imports: [
    CommonModule,
    ListCampusComponent,
    ListDiplomeComponent,
    ListEcoleComponent,
    ListFormationComponent,
    ListUnivComponent,
    SharedComponentModule
  ],
  templateUrl: './admin-start.component.html',
  styleUrl: './admin-start.component.scss'
})
export class AdminStartComponent implements OnInit {

  private roles!: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username!:string;
  
  constructor (private tokenStorageService: tokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;

      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showModeratorBoard = this.roles.includes('ROLE_MODERATOR');

      this.username = user.username;
      
    }
  }



  univView: boolean = true ;
  campusView!: boolean;
  formationView!: boolean;
  ecoleView!: boolean;
  diplomeView!: boolean;
  

 

  univClick(){
    this.univView = true;
    this.campusView = false;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
  };

  ecoleClick(){
    this.univView = false;
    this.ecoleView = true;
    this.campusView = false;
    this.formationView = false;
    this.diplomeView = false;
  };

  diplomeClick(){
    this.diplomeView = true;
    this.univView = false;
    this.ecoleView = false;
    this.campusView = false;
    this.formationView = false;
  };

  campusClick(){
    this.univView = false;
    this.campusView = true;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
  };

  formationClick(){
    this.univView = false;
    this.campusView = false;
    this.formationView = true;
    this.ecoleView = false;
    this.diplomeView = false;
  }

}
