import { Component, OnInit } from '@angular/core';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-politique',
  standalone: true,
  imports: [],
  templateUrl: './politique.component.html',
  styleUrl: './politique.component.scss'
})
export class PolitiqueComponent implements OnInit {

  constructor (private orientationService :OrientationService) {}

  
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
