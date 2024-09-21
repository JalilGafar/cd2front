import { Component, OnInit, inject } from '@angular/core';
import { ListCampusComponent } from '../list-campus/list-campus.component';
import { ListDiplomesComponent } from '../list-diplomes/list-diplomes.component';
import { ListEcolesComponent } from '../list-ecoles/list-ecoles.component';
import { ListFormationsComponent } from '../list-formations/list-formations.component';
import { ListUnivComponent } from '../list-univ/list-univ.component';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin-start',
  standalone: true,
  imports: [
    CommonModule,
    ListCampusComponent,
    ListDiplomesComponent,
    ListEcolesComponent,
    ListFormationsComponent,
    ListUnivComponent,
    SharedComponentModule
  ],
  templateUrl: './admin-start.component.html',
  styleUrl: './admin-start.component.scss'
})
export class AdminStartComponent implements OnInit {

  authService = inject(AuthService);
  router = inject(Router);
  public logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private roles!: string[];
  isLoggedIn = true;
  showAdminBoard = false;
  showModeratorBoard = false;
  username!:string;
  
  constructor () { }

  ngOnInit(): void {
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
