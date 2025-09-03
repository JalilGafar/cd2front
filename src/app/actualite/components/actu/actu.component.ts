import { Component, Input, OnInit } from '@angular/core';
import { Actualite } from '../../../model/actualite';
import { CommonModule } from '@angular/common';
import { ActuService } from '../../actu.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrientationService } from '../../../orientation/orientation.service';
import { BEHAVIOR } from '../../../model/behavior';

@Component({
  selector: 'app-actu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './actu.component.html',
  styleUrl: './actu.component.scss'
})
export class ActuComponent implements OnInit {

  Actualite$!: Observable<Actualite[]>;
  @Input() actualite!: Actualite;

  constructor(
    private actuService: ActuService,
    private orientationService :OrientationService,
    private appRout : Router){}

    ngOnInit() {
      this.Actualite$ = this.actuService.getAllActu();
    };

    onViewActu(subjectActu:string){
      this.appRout.navigateByUrl('actualite/blog/'+subjectActu)
    }

    ngAfterViewInit(): void {
      this.orientationService.scrollTo('header', BEHAVIOR.auto)
    } 

}
