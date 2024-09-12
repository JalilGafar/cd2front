import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-metier',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-metier.component.html',
  styleUrl: './info-metier.component.scss'
})
export class InfoMetierComponent implements OnInit{

  titre = "Un Métier qui te correspond";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";


  ngOnInit(): void {
    
  }

}
