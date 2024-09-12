import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-cqp',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-cqp.component.html',
  styleUrl: './info-cqp.component.scss'
})
export class InfoCqpComponent implements OnInit {

  titre = "Certificat de Qualification Professionnelle (CQP)";
  soustitre = "Comme Esso, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  
  ngOnInit(): void {
    
  }

}
