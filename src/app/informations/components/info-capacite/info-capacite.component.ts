import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-capacite',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-capacite.component.html',
  styleUrl: './info-capacite.component.scss'
})
export class InfoCapaciteComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";


  
  
  ngOnInit(): void {
    
  }

}
