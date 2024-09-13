import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

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

  constructor(
    private titleService:Title,
    private meta: Meta) 
    { 
      this.titleService.setTitle("Les Meilleurs Prépa au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Vous souhaitez facilement intégrer une grande école au Cameroun ou à l\'étranger ? Alors, le passage par une prépa est le moyen le plus sûr d\'atteindre votre objectif.' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, école, concours, grande école, emploie, Certificat, formation, Bac, Professionnel, Professionnelle'});
    }

  ngOnInit(): void {
    
  }

}
