import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-bts',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-bts.component.html',
  styleUrl: './info-bts.component.scss'
})
export class InfoBtsComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";


  
  ngOnInit(): void {
    
  }

}
