import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-video-slide',
  standalone: true,
  imports: [],
  templateUrl: './top-video-slide.component.html',
  styleUrl: './top-video-slide.component.scss'
})
export class TopVideoSlideComponent implements OnInit {

  constructor (private appRout: Router) {}
  ngOnInit(): void {
    
  }
  showOnePage(school: string){
    //const url = this.appRout.serializeUrl(this.appRout.createUrlTree(['etablissement/'], { queryParams: {school:school} }));
   // window.open(url, '_blank');
   this.appRout.navigate(['etablissement/'], { queryParams: {school:school} } );
  }
}
