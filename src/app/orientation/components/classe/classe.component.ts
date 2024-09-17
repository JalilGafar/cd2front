import { Component, OnInit } from '@angular/core';
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
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    
  }

  setClasse(classe: string) {
    this.orientationService.saveClasse(classe);
    this.appRout.navigate( ['orientation/contact/'] );
  }


}
