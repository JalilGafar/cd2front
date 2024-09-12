import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

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


  ngOnInit(): void {
    
  }

}
