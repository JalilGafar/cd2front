import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { Domaine } from '../../../admin/models/domaine.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoServices } from '../../information.services';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { FormationAdvers } from '../../../model/formadv';

@Component({
  selector: 'app-info-domaine-item',
  standalone: true,
  imports: [
    CommonModule,
    PubAdversComponent,
    SharedComponentModule
  ],
  templateUrl: './info-domaine-item.component.html',
  styleUrl: './info-domaine-item.component.scss'
})
export class InfoDomaineItemComponent implements OnInit {

  filiere!: Domaine[];
  advertiser$!: Observable<FormationAdvers[]>;


  constructor(
    private appRout: Router,
    private route: ActivatedRoute,
    private adversService: AdversService,
    private infoService: InfoServices
  ){}


  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.infoService.getFiliereById(+params['id'])),
      tap(filiere => this.filiere = filiere),
      tap(filiere => this.advertiser$ = this.adversService.getFormationPubByDom(filiere[0].id_dom))
      // tap(filiere => console.log(filiere[0])),
    ).subscribe()
    
  }

  trouverForm(){
    this.appRout.navigate(['./orientation/degree']);
  }

}
