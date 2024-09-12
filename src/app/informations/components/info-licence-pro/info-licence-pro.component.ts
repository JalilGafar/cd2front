import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-licence-pro',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-licence-pro.component.html',
  styleUrl: './info-licence-pro.component.scss'
})
export class InfoLicenceProComponent implements OnInit {

  titre = "Trouvez votre Licence Pro";
  soustitre = "Comme Choupo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";


  ngOnInit(): void {
    
  }

}
