import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { Observable, tap } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { InfoServices } from '../../information.services';
import { Router } from '@angular/router';
import { Domaine } from '../../../admin/models/domaine.model';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';

@Component({
  selector: 'app-info-diplome',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-diplome.component.html',
  styleUrl: './info-diplome.component.scss'
})
export class InfoDiplomeComponent implements OnInit {

  titre = "Trouvez votre formation au Cameroun";
  soustitre = "Comme Fadimatou, elles sont nombreuse à utiliser Camerdiplome pour trouver leur école";
  photo = "./../../assets/images/fati_lon_mini.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;
  domaines$!: Observable<Domaine[]>;
  domainesShort: Domaine[] = [];
  domainesTransit: Domaine[] = [];
  domainesLong: Domaine[] = [];
  plusDom : string = 'Plus de filière';
  activeIndex: number = 0;
  branch!: {branche_dom: string} [];


  constructor( 
    private titleService:Title, 
    private adversService: AdversService,
    private infoService: InfoServices,
    private appRout : Router,
    private meta: Meta
  ) {
      this.titleService.setTitle("Les filière de formation au Cameroun");
      this.meta.updateTag({ name: 'description', content: 'CAP, Bac, DQP, CQP, Master, BTS, Licence, Bachelor, HND, Licence pro, Prepa, Capacité' });
      this.meta.updateTag({ name: 'keywords', content: 'CAP, Bac, DQP, CQP, Master, BTS, Licence, Bachelor, HND, Licence pro, Prepa, Capacité' });
    }

  
  trouverForm(){
    this.appRout.navigate(['./orientation/degree']);
  }

  ngOnInit(){
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.infoService.getBranche().pipe(
      tap(data => this.branch = data)
    ).subscribe();
    this.infoService.getDomainList().pipe(
      tap(data => {
        this.domainesLong = data
        for (let index = 0; index < 8; index++) {
          this.domainesShort.push(data[index])
        }
        this.domainesTransit = this.domainesShort
      })
    ).subscribe();
  }

  voirFiliere(idDom:number){
    this.appRout.navigateByUrl('info/domaine/'+ idDom);
  }

  plusFiliere(){
    if (this.plusDom === 'Plus de filière' ) {
      this.domainesTransit = this.domainesLong;
      this.plusDom = 'Voir moins'
    } else {
      this.plusDom = 'Plus de filière'
      this.domainesTransit = this.domainesShort;
    }
  };


}
