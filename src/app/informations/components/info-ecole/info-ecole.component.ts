import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-ecole',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-ecole.component.html',
  styleUrl: './info-ecole.component.scss'
})
export class InfoEcoleComponent implements OnInit{

  titre = "Trouvez votre formation";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";


  ngOnInit(): void {
    
  }

}
