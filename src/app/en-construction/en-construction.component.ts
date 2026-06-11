import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../shared/shared.modules';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-en-construction',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './en-construction.component.html',
  styleUrl: './en-construction.component.scss'
})
export class EnConstructionComponent implements OnInit {

  constructor (private orientationService :OrientationService,
               @Inject(PLATFORM_ID) private platformId: Object) {}



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
