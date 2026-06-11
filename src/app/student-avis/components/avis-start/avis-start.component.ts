import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    private appRout : Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
