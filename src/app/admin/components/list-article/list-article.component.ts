import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
    private appRout : Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }
      
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
