import { Component, Input, OnInit } from '@angular/core';
import { Actualite } from '../../../model/actualite';
import { CommonModule } from '@angular/common';
import { ActuService } from '../../actu.service';
import { Router } from '@angular/router';

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

  @Input() actualite!: Actualite;

  constructor(private actuService: ActuService,
    private appRout : Router){}

  ngOnInit(): void {
    
  }

  onViewFaceSnap(){
    // this.appRout.navigateByUrl('actualite/'+ this.actualite.id_news);
  }

}
