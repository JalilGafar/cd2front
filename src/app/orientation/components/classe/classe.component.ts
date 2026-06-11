import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OrientationService } from '../../orientation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-classe',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './classe.component.html',
  styleUrl: './classe.component.scss'
})
export class ClasseComponent implements OnInit {

  classe = ['Terminale', 'Première', 'Seconde', '3e', '4e', '5e', '6e'];

  constructor (private orientationService :OrientationService,
    private appRout : Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  setClasse(classe: string) {
    this.orientationService.saveClasse(classe);
    this.appRout.navigate( ['orientation/contact/'] );
  }


}
