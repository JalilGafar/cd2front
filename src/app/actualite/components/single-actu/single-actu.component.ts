import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actualite } from '../../../model/actualite';
import { Observable } from 'rxjs';
import { ActuService } from '../../actu.service';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { OrientationService } from '../../../orientation/orientation.service';
import { BEHAVIOR } from '../../../model/behavior';

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

  constructor(
    private ActuService: ActuService,
    private route: ActivatedRoute,
    private meta : Meta,
    private titleService:Title,
    private orientationService :OrientationService
  ){}

  private initMetaForMyPage(){
    if (this.actualite) {
      this.titleService.setTitle(this.actualite.title)
      this.meta.updateTag({ name: 'keywords', content: this.actualite.keywords+', Etablissement, MINESUP, Orientation, Cameroun, Etudes supérieures, Formation professionnelle, Travail, Enseignement, Diplômes, Universités, Grandes écoles, Instituts, Centres de formation, Carrière, Emploi, Métiers' });
      this.meta.updateTag({ name: 'description', content: this.actualite.summary});
    }
  }

  ngOnInit(){
    //this.buttonText = 'Oh Snap !';
    const actuId = +this.route.snapshot.params['id'];
    console.log(actuId);
    this.actualite$ = this.ActuService.getActualiteById(actuId);
    this.actualite$.subscribe(actu=> {
      this.actualite = actu[0]
      this.initMetaForMyPage()
    })
  } 

  ngAfterViewInit(): void {
      this.orientationService.scrollTo('header', BEHAVIOR.auto)
    } 

}
