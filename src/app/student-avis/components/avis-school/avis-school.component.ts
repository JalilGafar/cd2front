import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from '../../../general.service';
import { AvisService } from '../../avis.service';
import { BEHAVIOR } from '../../../model/behavior';
import { Observable, switchMap, tap } from 'rxjs';
import { Avis } from '../../../model/avis-model';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AvisSingleComponent } from '../avis-single/avis-single.component';
import { EcoleAvis } from '../../../model/ecole-avis-model';

@Component({
  selector: 'app-avis-school',
  standalone: true,
  imports: [
    SharedComponentModule,
    AvisSingleComponent
  ],
  templateUrl: './avis-school.component.html',
  styleUrl: './avis-school.component.scss'
})
export class AvisSchoolComponent implements OnInit {

  avisList$!: Observable<Avis[]>; 
  avisList!:Avis[];
  schoolNote$!: Observable<EcoleAvis[]>;
  note!: number;
  code!: number;


  constructor(
    private generalService : GeneralService,
    private avisService : AvisService,
    private route: ActivatedRoute,
    private appRout : Router
  ){}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.avisService.getAvisForSchoolId(+params['id'])),
      tap(aviss=>this.avisList = aviss)
    ).subscribe();

    this.schoolNote$ = this.route.params.pipe(
      switchMap(params => this.avisService.getEcoleAvisById(+params['id'])),
      tap(ecole => this.note = Math.round(ecole[0].notes_moy)),
      tap(ecole => this.code = ecole[0].id_ecol),
    );
    
  }

  tonAvis(){
    this.appRout.navigateByUrl('avis/monAvis/'+ this.code);
  }



  ngAfterViewInit(): void {
    this.generalService.scrollTo('header', BEHAVIOR.auto)
  }

}
