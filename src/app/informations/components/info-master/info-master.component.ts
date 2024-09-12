import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-master',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-master.component.html',
  styleUrl: './info-master.component.scss'
})
export class InfoMasterComponent implements OnInit {

  titre = "Trouvez votre Master";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";

  ngOnInit(): void {
    
  }

}
