import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor( 
    private titleService:Title,
    private meta : Meta) 
    {
      this.titleService.setTitle("Liste des BTS | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'BTS signification, niveau, débouchés et listes des différents de BTS' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, BTS, Informatique, Infirmier, communication, emploie, formation, Bac, Professionnel, Professionnelle' });
    }



  ngOnInit(): void {
    
  }

}
