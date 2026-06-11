import { AfterViewInit, Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { ville } from '../../../model/ville-model';
import { OrientationService } from '../../orientation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { BEHAVIOR } from '../../../model/behavior';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './city.component.html',
  styleUrl: './city.component.scss'
})

export class CityComponent implements OnInit, AfterViewInit{

  @Input() cyties$!: Observable<ville[]>;

  loading$!: Observable<boolean>;

  constructor (private orientationService :OrientationService,
                private appRout : Router,
                private route: ActivatedRoute,
              //  private topNewsService: TopNewsService,
                private titleService:Title,
                @Inject(PLATFORM_ID) private platformId: Object) {this.titleService.setTitle("Trouver une bonne école de formation au Cameroun");}

  ngOnInit():void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loading$ = this.orientationService.loading$;
    let degree = this.route.snapshot.queryParams['degree'];
    let branche = this.route.snapshot.queryParams['branche'];
    let field = this.route.snapshot.queryParams['field'];
    if (field  && degree) {
      //console.log('normalement')
        this.cyties$ = this.orientationService.cyties$
      //this.cyties$ = this.orientationService.getAllCyties();
      // this.cyties$ = this.orientationService.getPartCyties( degree, field, branche);
      this.orientationService.getPartCyties( degree, field, branche);
    } else {
      /*Envoyer une requete de toutes les villes ayant un campus*/
      this.cyties$ = this.orientationService.getAllCyties();
    }
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

  setNiveau(){}
  
  setCyti (cyti : string) {
    let degree = this.route.snapshot.queryParams['degree'];
    let field = this.route.snapshot.queryParams['field'];
    let branche = this.route.snapshot.queryParams['branche'];
    if (degree && field ) {
      this.appRout.navigate(
        ['orientation/statuts/'],
        {queryParams: {degree:degree, field:field, branche:branche, cyti:cyti} }
      );
    } else {
      this.appRout.navigate(
        ['orientation/degree/'],
        {queryParams: {cyti:cyti} }
      );
    }
  }


}
