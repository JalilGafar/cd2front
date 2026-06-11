import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { interestelt } from '../../../model/interest-item-model';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { OrientationService } from '../../orientation.service';
import { BEHAVIOR } from '../../../model/behavior';


@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.scss'
})


export class ResultatsComponent implements OnInit{
  
  school$!: Observable <interestelt[]>;
  loading$!: Observable<boolean>;

  constructor (private orientationService : OrientationService,
               @Inject(PLATFORM_ID) private platformId: Object){}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.loading$ = this.orientationService.loading$;
    this.orientationService.getSerchResult().subscribe()
    this.school$ = this.orientationService.school$ 
  }

  ngAfterViewInit(): void { 
      this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }
}
