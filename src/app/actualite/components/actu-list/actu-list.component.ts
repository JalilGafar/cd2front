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

  onViewActu(idActu:number){
    console.log(idActu)
    this.appRout.navigateByUrl('actualite/blog/'+idActu);
  }

}
