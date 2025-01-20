import { Component, OnInit } from '@angular/core';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit  {

  constructor (private orientationService :OrientationService) {}

  discover(){
    let c = encodeURI('Je souhaite améliorer la visibilité de mon établissement sur Camerdiplome !');
    let url = `https://wa.me/237679197112?text=${c}`
    window.location.href = url;
  }

    
  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
