import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { OrientationService } from '../../orientation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dernierdiplome',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './dernierdiplome.component.html',
  styleUrl: './dernierdiplome.component.scss'
})
export class DernierdiplomeComponent {

  constructor( private orientationService: OrientationService,
    private appRout : Router,) {}

  niveau = [
    'CEP',
    'BEPC ou équivalent',
    'Probatoir ou équivalent',
  'Bac ou équivalent',
  'Bac+1',
  'Bac+2',
  'Bac+3',
  'Bac+4',
  'Bac+5',
  'Bac+6 et plus'
  ];

  setNiveau(niveau: string) {
    this.orientationService.saveClasse(niveau);
    this.appRout.navigate( ['orientation/contact/'] );
  }

}
