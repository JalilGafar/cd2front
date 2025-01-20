import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { filter, map, Observable, tap } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { EcoleFind } from '../../../model/ecoleFind-model';
import { InfoServices } from '../../information.services';
import { FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { event } from 'jquery';

@Component({
  selector: 'app-info-ecole',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-ecole.component.html',
  styleUrl: './info-ecole.component.scss'
})
export class InfoEcoleComponent implements OnInit{

  titre = "Les établissements au Cameroun";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;
  ecole$!: Observable<EcoleFind[]>;
  ecole!: EcoleFind[];
  countEcole: number = 0;
  loading$!: Observable<boolean>;
  absent: string= 'absent-off'
  ets = new FormControl('', Validators.required)
  etsi : FormControl = new FormControl('', Validators.required)
  constructor( //private infoservice :InfoServices,
    private titleService:Title,
    private adversService: AdversService,
    private infoService: InfoServices,
    private appRout : Router
  ) 
    {
      // if (this.ets) {        
      //   this.titleService.setTitle(this.ets.value+'');
      // }
      //this.ets.setValue('ggg')
    }



  ngOnInit(): void {
    // this.appRout.events.pipe(
    //   filter(event => event instanceof NavigationEnd),
    // ).subscribe(()=> this.titleService.setTitle(this.ets.value+''))


    this.loading$ = this.infoService.loading$

    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.ecole$ = this.infoService.getEcoleFind().pipe(
      tap(data => this.countEcole = data.length ),
      tap(data => this.ecole = data ),
      // tap(() => this.loading$.subscribe(loading$.next) ),
      map(data => data.map(data => ({
        ...data,
        displayName : data.sigle_e+'   '+data.nom_e+' ||'+data.id_ecol
      })))
    ) ;
  }

  onFind(){
    if (this.ets.invalid) {
      return;
    }else if (this.ets.value != null) { 
      console.log(this.ets)  
      // this.appRout.navigate(['info/ecole/'+ this.ets.value] , {queryParams:{detail: paramsValue}})  

     let  tt = parseInt(this.ets.value[this.ets.value.indexOf("||") + 2] + this.ets.value[this.ets.value?.indexOf("||") + 3] + this.ets.value[this.ets.value?.indexOf("||") + 4])
      if (isNaN(tt)) {
        this.absent = 'absent-on'                                            
      }else {
        // this.appRout.navigateByUrl('info/ecole/'+ tt+'', {details:});    
        let paramsValue = this.ets.value.split(' ').join('_').toLowerCase()
        this.appRout.navigate(['info/ecole/'+ tt] , {queryParams:{detail: paramsValue}})                                            
      }
    }
  }

  hiden(){
    this.absent = 'absent-off'
  }

}
