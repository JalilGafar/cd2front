import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-article',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-article.component.html',
  styleUrl: './new-article.component.scss'
})
export class NewArticleComponent implements OnInit {

  newArticle!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private adminService: AdminService,
    private appRout : Router,
    @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newArticle = this.formBuilder.group({
    title : [null],
    auteur : [null],
    visible : [null],
    summary : [null],
    illustration : [null],
    content : [null],
    sujets : [null],
    keywords: [null]
    });
  }

  onSubmitForm(){
    console.log(this.newArticle.value);
    this.adminService.addNewArticle(this.newArticle.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  }
}
