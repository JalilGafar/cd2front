import { Component, Input, OnInit } from '@angular/core';
import { SchoolAdvers } from '../../../model/school-adv';
import { Router } from '@angular/router';

@Component({
  selector: 'app-school-advers',
  standalone: true,
  imports: [],
  templateUrl: './school-advers.component.html',
  styleUrl: './school-advers.component.scss'
})
export class SchoolAdversComponent implements OnInit {

  @Input() schoolAdv!: SchoolAdvers;

  constructor(
    private appRout: Router,
  ){}

  ngOnInit(): void {
    
  }

  showOnePage(school: number){
    this.appRout.navigateByUrl('info/ecole/'+ school);
  }

  splitStringToArray(str: string){
    if(str=== null){
      str = 'noImage'
    }
    return str.split('').reduce((acc:string[], char:string) => {
      if (char ===' '){
        acc.push('');
      }else {
        acc[acc.length - 1] += char;
      } return acc;
    }, ['']);
  }
}
