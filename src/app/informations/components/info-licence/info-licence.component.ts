import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { interestelt } from '../../../model/interest-item-model';

@Component({
  selector: 'app-info-licence',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-licence.component.html',
  styleUrl: './info-licence.component.scss'
})
export class InfoLicenceComponent implements OnInit {

  titre = "Trouvez votre licence";
  soustitre = "Comme Choupo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-rdne-stock-project.webp";
  school$!: Observable<interestelt[]>


  ngOnInit(): void {
    
  }

}
