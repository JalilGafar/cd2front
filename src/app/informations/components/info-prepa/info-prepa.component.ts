import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-prepa',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-prepa.component.html',
  styleUrl: './info-prepa.component.scss'
})
export class InfoPrepaComponent implements OnInit {

  titre = "Prépa";
  soustitre = "Comme Dobo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";


  ngOnInit(): void {
    
  }

}
