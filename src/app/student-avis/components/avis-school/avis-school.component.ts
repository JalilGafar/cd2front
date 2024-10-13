import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from '../../../general.service';
import { AvisService } from '../../avis.service';
import { BEHAVIOR } from '../../../model/behavior';
import { Observable, switchMap, tap } from 'rxjs';
import { Avis } from '../../../model/avis-model';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AvisSingleComponent } from '../avis-single/avis-single.component';

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


  constructor(
    private generalService : GeneralService,
    private avisService : AvisService,
    private route: ActivatedRoute
  ){}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.avisService.getAvisForSchoolId(+params['id'])),
      tap(aviss=>this.avisList = aviss)
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.generalService.scrollTo('header', BEHAVIOR.auto)
  }

}
