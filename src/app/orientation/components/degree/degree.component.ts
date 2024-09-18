import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { degree } from '../../../model/degree-model';
import { OrientationService } from '../../orientation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BEHAVIOR } from '../../../model/behavior';

@Component({
  selector: 'app-degree',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './degree.component.html',
  styleUrl: './degree.component.scss'
})
export class DegreeComponent implements OnInit, AfterViewInit {

  degree$!: Observable<degree[]>;
  degreeView!: degree [];
  loading$!: Observable<boolean>;
  testeur = "NgOnInit n'est pas lancé !"
  cap = {groupe: 'CAP ou équivalent'};
  bac = {groupe: 'Bac ou équivalent'};
  bts = {groupe: 'Bac+1 à Bac+2'};
  licence = {groupe: 'Bac+3'};
  master = {groupe: 'Bac+4 à Bac+5'};
  doctor = {groupe: 'Bac+6 et plus'};
  autre = {groupe: 'Autre'};

  capLenght!: number
  bacLenght!: number
  btsLenght!: number
  liLenght!: number
  masLenght!: number
  docLenght!: number
  autLenght!: number


  constructor (
     private orientationService :OrientationService,
     private appRout : Router,
     private route: ActivatedRoute,
    //private topNewsService: TopNewsService,
    private titleService:Title) {this.titleService.setTitle("quel diplome pour ma formation au Cameroun");}


  ngOnInit() {

    this.loading$ = this.orientationService.loading$;
    // this.testeur = "NgOnInit est lancé !";
    this.degree$ = this.orientationService.degree$
    this.orientationService.getDegreeCyti('tous').subscribe(
      // data => {
      //   this.degreeView = data
      // }
    );
    
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

  setDegree(degree : string){
    let cyti = this.route.snapshot.queryParams['cyti'];
    let field = this.route.snapshot.queryParams['field'];
    //***Si field et cyti ne sont pas défini, on passe a la page "domaine" */
    if ( field === undefined && cyti === undefined) {
      this.appRout.navigate(
        ['orientation/field/'],
        {queryParams:  {degree:degree} }
      );
    } else if (cyti !== undefined) {
      //**Si cyti seulement est défini, on le met en queryParams et on passe a la page "domaine" */
      this.appRout.navigate(
        ['orientation/domaines/'],
        {queryParams:  {degree:degree, cyti:cyti} }
      );
    } else if (field !== undefined) {
      //** Si field est défini, on le met en queryParams et on passe à la page "city" */
      this.appRout.navigate(
        ['orientation/city/'],
        {queryParams: {degree:degree, field:field} }
      );
    }
  }

  setNiveau(){
    
  }

}
