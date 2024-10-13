import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../../general.service';
import { BEHAVIOR } from '../../../model/behavior';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AvisService } from '../../avis.service';
import { EcoleAvis } from '../../../model/ecole-avis-model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-avis-start',
  standalone: true,
  imports: [
    SharedComponentModule,
    CommonModule
  ],
  templateUrl: './avis-start.component.html',
  styleUrl: './avis-start.component.scss'
})
export class AvisStartComponent implements OnInit{

  ecoleAvis$!: Observable<EcoleAvis[]>;

  constructor(
    private generalService : GeneralService,
    private avisService : AvisService,
    private appRout : Router
  ){}

  ngOnInit(): void {
    this.InitObservable();
    this.avisService.getEcoleAvisFromServer()
  }

  ngAfterViewInit(): void {
    this.generalService.scrollTo('header', BEHAVIOR.auto)
  }

  private InitObservable(){
    this.ecoleAvis$ = this.avisService.ecoleAvis$;
  }

  elmtClick(event:any){
    this.appRout.navigateByUrl('avis/avisSchool/'+ event.value[0].id_ecol.toString());
    console.log(event.value[0].id_ecol)
  }

}
