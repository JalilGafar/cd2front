import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actualite } from '../../../model/actualite';
import { Observable } from 'rxjs';
import { ActuService } from '../../actu.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-single-actu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './single-actu.component.html',
  styleUrl: './single-actu.component.scss'
})
export class SingleActuComponent implements OnInit {

  actualite!: Actualite;
  actualite$!: Observable<Actualite[]>
  buttonText!: string;

  constructor(private ActuService: ActuService,
    private route: ActivatedRoute){}

  ngOnInit(){
    //this.buttonText = 'Oh Snap !';
    const actuId = +this.route.snapshot.params['id'];
    console.log(actuId);
    this.actualite$ = this.ActuService.getActualiteById(actuId);
  } 

}
