import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable, switchMap, tap } from 'rxjs';
import { Article } from '../../models/article.model';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-single-article',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule

  ],
  templateUrl: './single-article.component.html',
  styleUrl: './single-article.component.scss'
})
export class SingleArticleComponent implements OnInit {

  loading$!: Observable<boolean>;
  article$!: Observable<Article>;
  article!: Article;

  constructor(private adminService : AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
  this.initObservables ()
  }

  initObservables(){
    this.loading$ = this.adminService.loading$;
    this.article$ = this.route.params.pipe(
      switchMap(params => this.adminService.getArticleById(+params['id'])),
      tap(article=>this.article = article)
    );
    console.log(this.article)
  }

  onModif(){
    this.router.navigateByUrl('admin/modif-article/'+ this.article.id_actu.toString())    
  }

  onDelet(){
    this.adminService.deletArticleById(this.article.id_actu).subscribe();
    this.router.navigateByUrl('/admin/adminStart')
  }

  onGoBack(){
    this.router.navigateByUrl('/admin/adminStart')
  }

}
