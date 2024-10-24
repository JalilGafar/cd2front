import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { interestelt } from '../../../model/interest-item-model';
import { Observable } from 'rxjs';
import { InfoServices } from '../../information.services';
import { CommonModule } from '@angular/common';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { AdversService } from '../../../service/advers.service';
import { FormationAdvers } from '../../../model/formadv';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { SchoolAdvers } from '../../../model/school-adv';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';


@Component({
  selector: 'app-info-metier',
  standalone: true,
  imports: [
    SharedComponentModule,
    PubAdversComponent,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-metier.component.html',
  styleUrl: './info-metier.component.scss'
})
export class InfoMetierComponent implements OnInit{

  titre = "Un Métier qui te correspond";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../assets/images/pexels-3.webp";

  advertiser$!: Observable<FormationAdvers[]>;
  schoolAdvers$!: Observable<SchoolAdvers[]>
  metierListe$!: Observable<[{id_metier:number, titre:string}]>

  plusMetiertext = 'Voir plus de métier'

  schoolAdvers = ['vrai', 'faux', 'orange', 'noir']

  // school$!: Observable <interestelt[]>;


  constructor( 
    private appRout: Router,
    private titleService:Title,
    private adversService: AdversService,
    private infoService: InfoServices
    ) 
    {this.titleService.setTitle("Les Métiers d'avenir | Camerdiplome");}

    trouverForm(){
      this.appRout.navigate(['./orientation/degree']);
    }

    

  ngOnInit(): void {
    this.advertiser$ = this.adversService.getFormationPub();
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.metierListe$ = this.infoService.getMetierList()
    //this.school$ = this.infoService.getAdvers()
  }

  plusMetier(){
    if (this.plusMetiertext == 'Voir plus de métier') {      
      this.metierListe$ = this.infoService.getMetierLongList();
      this.plusMetiertext = 'Voir moins'
    } else {
      this.metierListe$ = this.infoService.getMetierList();
      this.plusMetiertext = 'Voir plus de métier'
    }
  }

  metier(idMetier:number){
    this.appRout.navigateByUrl('info/metier/'+ idMetier);
  }

}
