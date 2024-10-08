import { Component, OnInit } from '@angular/core';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  constructor (private orientationService :OrientationService) {}

  
  
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
