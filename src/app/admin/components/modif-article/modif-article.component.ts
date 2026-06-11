import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Article } from '../../models/article.model';
import { Observable, switchMap, take, tap } from 'rxjs';
import { title } from 'process';

@Component({
  selector: 'app-modif-article',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './modif-article.component.html',
  styleUrl: './modif-article.component.scss'
})
export class ModifArticleComponent implements OnInit {

  modifArticle!: FormGroup;
  article$!: Observable<Article>
  display = false;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private route: ActivatedRoute,
    private appRout: Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.onDialogShow()
    this.modifArticle = this.formBuilder.group({
      id_actu:[null],
      title: [null],
      auteur: [null],
      visible: [null],
      summary: [null],
      illustration: [null],
      content: [''],
      sujets: [null],
      keywords:[null]
    });
  }

  onDialogShow(){
    this.article$ = this.route.params.pipe(
      switchMap(params => this.adminService.getArticleById(+params['id'])),
      take(1),
      tap(val => {
        this.modifArticle.patchValue({
          id_actu: val.id_actu,
          title: val.title,
          auteur: val.auteur,
          visible: val.visible,
          summary: val.summary,
          illustration: val.illustration,
          content: val.content,
          sujets: val.sujets,
          keywords: val.keywords
        });
        console.log(val.content)
      })
    );
  }

  ngAfterViewInit(){
    setTimeout(()=>{
      this.modifArticle.patchValue({
        content:'ffffffffffffff'
      })
    }, 800)
  }


  onSubmitForm() {
    console.log(this.modifArticle.value);
    this.adminService.editArticle(this.modifArticle.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  }

  onReturn() {
    this.appRout.navigateByUrl('admin/adminStart');
  }
}
