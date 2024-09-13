import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-bachelor',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-bachelor.component.html',
  styleUrl: './info-bachelor.component.scss'
})
export class InfoBachelorComponent implements OnInit {

  titre = "Find your Bachelor's degree";
  soustitre = "Like Jules, 40% of high school graduates use Camerdiplome to find their school";
  photo = "./../../../../assets/images/pexels-kampus-productiont.webp";

  constructor( //private infoservice :InfoServices,
    private titleService:Title) {this.titleService.setTitle("Le bac technique au Cameroun | Camerdiplome");}



  ngOnInit(): void {
    
  }

}
