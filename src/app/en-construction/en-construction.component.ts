import { Component, OnInit } from '@angular/core';
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

  constructor (private orientationService :OrientationService) {}

  
  
  ngOnInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
