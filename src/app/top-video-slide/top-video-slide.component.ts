import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SchoolAdvers } from '../model/school-adv';
import { AdversService } from '../service/advers.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-video-slide',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './top-video-slide.component.html',
  styleUrl: './top-video-slide.component.scss'
})
export class TopVideoSlideComponent implements OnInit {

  schoolAdvers$!: Observable<SchoolAdvers[]>

  constructor (
    private appRout: Router,
    private adversService: AdversService
  ) {}
  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }
  showOnePage(school: number){
   this.appRout.navigateByUrl('info/ecole/'+ school);
  }

  splitStringToArray(str: string){
    if(str === null || str === undefined){
      str = 'noImage.webp'
      return str
    } else {
      return str.split('').reduce((acc:string[], char:string) => {
        if (char ===' '){
          acc.push('');
        }else {
          acc[acc.length - 1] += char;
        } return acc;
      }, ['']);
    }
  }
}
