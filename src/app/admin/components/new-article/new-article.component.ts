import { Component, OnInit } from '@angular/core';
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
    private appRout : Router){}

  ngOnInit(): void {
    this.newArticle = this.formBuilder.group({
    title : [null],
    auteur : [null],
    visible : [null],
    summary : [null],
    illustration : [null],
    content : [null],
    sujets : [null],
    });
  }

  onSubmitForm(){
    console.log(this.newArticle.value);
    this.adminService.addNewArticle(this.newArticle.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  }
}
