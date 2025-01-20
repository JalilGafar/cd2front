import { Component, OnInit } from '@angular/core';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-condition',
  standalone: true,
  imports: [],
  templateUrl: './condition.component.html',
  styleUrl: './condition.component.scss'
})
export class ConditionComponent implements OnInit {

  constructor (private orientationService :OrientationService) {}

  
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }  

}
