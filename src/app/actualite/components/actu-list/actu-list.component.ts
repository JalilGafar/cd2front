import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Actualite } from '../../../model/actualite';
import { ActuService } from '../../actu.service';
import { ActuComponent } from '../actu/actu.component';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Router } from '@angular/router';

@Component({
  selector: 'app-actu-list',
  standalone: true,
  imports: [
    ActuComponent,
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './actu-list.component.html',
  styleUrl: './actu-list.component.scss'
})
export class ActuListComponent implements OnInit {

  Actualite$!: Observable<Actualite[]>;
  responsiveOptions;
  classer :string ='carousel-item';



  constructor(private actuService: ActuService,
    private appRout : Router) {
    this.responsiveOptions = [
      {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
      },
      {
          breakpoint: '768px',
          numVisible: 2,
          numScroll: 2
      },
      {
          breakpoint: '560px',
          numVisible: 1,
          numScroll: 1
      }
  ];
  };

  ngOnInit() {
    this.Actualite$ = this.actuService.getAllActu();
    
  };

  // fonction qui permet de transformer une serie de mot en array
  splitStringToArray(str: string | null){
    if(str=== null || str === undefined ){
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

  onViewActu(idActu:number){
    this.appRout.navigateByUrl('actualite/blog/'+idActu)
  }
  
        

}
