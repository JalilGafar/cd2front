import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor( 
    private titleService:Title,
    private meta: Meta) 
    { 
      this.titleService.setTitle("Le Certificat de Qualification Professionnelle (CQP) au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Le Certificat de Qualification Professionnelle (CQP)est une certification créée et délivrée par une branche professionnelle, via la Commission Paritaire Nationale de l’Emploi et de la Formation professionnelle.' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, emploie,Certificat, CQP, DQP, formation, Bac, Professionnel, Professionnelle, Technique' });
    }

  
  ngOnInit(): void {
    
  }

}
