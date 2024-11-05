import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { Etablissement } from '../../../model/etablissement-model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoServices } from '../../information.services';
import { PrimengModule } from '../../../shared/primeng.modules';
import { AvisService } from '../../../student-avis/avis.service';
import { Avis } from '../../../model/avis-model';
import { EcoleAvis } from '../../../model/ecole-avis-model';
import { AvisSingleComponent } from '../../../student-avis/components/avis-single/avis-single.component';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { FormationAdvers } from '../../../model/formadv';
import { AdversService } from '../../../service/advers.service';

@Component({
  selector: 'app-info-ecole-item',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    AvisSingleComponent,
    PubAdversComponent
  ],
  templateUrl: './info-ecole-item.component.html',
  styleUrl: './info-ecole-item.component.scss'
})
export class InfoEcoleItemComponent implements OnInit{

  ecole!: Etablissement[];
  imageArray!: string[];
  parrainArray!:string[];
  avisList$!: Observable<Avis[]>; 
  avisList!:Avis[];
  schoolNote$!: Observable<EcoleAvis[]>;
  note!: number;
  code!: number;
  advertiser$!: Observable<FormationAdvers[]>;

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices,
    private avisService : AvisService,
    private adversService: AdversService,
    private appRout : Router
  ){}

  ngOnInit(): void {

    this.route.params.pipe(
      switchMap(params => this.infoService.getEcoleById(+params['id'])),
      tap(ecole=> this.ecole = ecole ),
      tap(ecole => this.imageArray = this.splitStringToArray(ecole[0].image_e)),
      tap(ecole => this.parrainArray = this.splitStringToArray(ecole[0].parrain))
    ).subscribe();

    this.route.params.pipe(
      switchMap(params => this.avisService.getAvisForSchoolId(+params['id'])),
      tap(aviss=>this.avisList = aviss)
    ).subscribe();

    this.schoolNote$ = this.route.params.pipe(
      switchMap(params => this.avisService.getEcoleAvisById(+params['id'])),
      tap(ecole => this.note = Math.round(ecole[0].notes_moy)),
      tap(ecole => this.code = ecole[0].id_ecol),
    );
    
    this.advertiser$ = this.route.params.pipe(
      switchMap(params => this.adversService.getFormationPubForShool(+params['id'])),
    );
  }

  trouverForm(){
    this.appRout.navigate(['./orientation/degree']);
  }

  tonAvis(){
    this.appRout.navigateByUrl('avis/monAvis/'+ this.code);
  }

  splitStringToArray(str: string){
    if(str === null){
      str = ''
    }
    return str.split('').reduce((acc:string[], char:string) => {
      if (char ===' '){
        acc.push('');
      }else {
        acc[acc.length - 1] += char;
      } return acc;
    }, ['']);
  }

  

}
