import { Component, OnInit } from '@angular/core';
import { tokenStorageService } from '../../../service/token-storage.service';
import { CommonModule } from '@angular/common';
import { ListCampusComponent } from '../list-campus/list-campus.component';
import { ListDiplomeComponent } from '../list-diplome/list-diplome.component';
import { ListEcoleComponent } from '../list-ecole/list-ecole.component';
import { ListFormationComponent } from '../list-formation/list-formation.component';
import { ListUnivComponent } from '../list-univ/list-univ.component';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AdminService } from '../../admin.service';
import { BEHAVIOR } from '../../../model/behavior';
import { ListArticleComponent } from '../list-article/list-article.component';
import { ListAvisComponent } from '../list-avis/list-avis.component';

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
    ListArticleComponent,
    ListAvisComponent,
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
  
  constructor (
    private adminService: AdminService,
    private tokenStorageService: tokenStorageService) { }

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
  articleView!: boolean;
  avisView!: boolean;

  univClick(){
    this.univView = true;
    this.campusView = false;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
    this.articleView = false;
    this.avisView = false;
  };

  ecoleClick(){
    this.univView = false;
    this.ecoleView = true;
    this.campusView = false;
    this.formationView = false;
    this.diplomeView = false;
    this.articleView = false;
    this.avisView = false;
  };

  diplomeClick(){
    this.diplomeView = true;
    this.univView = false;
    this.ecoleView = false;
    this.campusView = false;
    this.formationView = false;
    this.articleView = false;
    this.avisView = false;
  };

  campusClick(){
    this.univView = false;
    this.campusView = true;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
    this.articleView = false;
    this.avisView = false;
  };

  formationClick(){
    this.univView = false;
    this.campusView = false;
    this.formationView = true;
    this.ecoleView = false;
    this.diplomeView = false;
    this.articleView = false;
    this.avisView = false;
  }
  
  ArticleClick(){
    this.univView = false;
    this.campusView = false;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
    this.articleView = true;
    this.avisView = false;
  }

  AvisClick(){
    this.univView = false;
    this.campusView = false;
    this.formationView = false;
    this.ecoleView = false;
    this.diplomeView = false;
    this.articleView = false;
    this.avisView = true;
  }

  ngAfterViewInit(): void {
    this.adminService.scrollTo('header', BEHAVIOR.auto)
  }

}
