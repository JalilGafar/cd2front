import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Article } from '../../models/article.model';
import { Observable } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-article',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-article.component.html',
  styleUrl: './list-article.component.scss'
})
export class ListArticleComponent implements OnInit {

  article$!: Observable<Article[]>;
  loading$!: Observable<boolean>;

  
  constructor(private adminService: AdminService,
    private appRout : Router) { }
      
  ngOnInit(): void {
  this.InitObservable();
  this.adminService.getArticleFromServer();
  }

  private InitObservable(){
  this.loading$ = this.adminService.loading$;
  this.article$ = this.adminService.article$;
  }

  onRowSelect(event:any){
  this.appRout.navigateByUrl('admin/article/'+ event.data.id_actu.toString());
  }

  onAddArticle(){
    this.appRout.navigateByUrl('admin/new-article');
  }

}
