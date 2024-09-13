import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-capacite',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-capacite.component.html',
  styleUrl: './info-capacite.component.scss'
})
export class InfoCapaciteComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";

  constructor(
    private titleService:Title,
    private meta : Meta) 
    {  
      this.titleService.setTitle("Capacité en Droit et Économie au Cameroun | Camerdiplome ");
      this.meta.updateTag({ name: 'description', content: 'La capacité en droit et Économie offre une formation universitaire juridique générale à tous publics avec pour condition d\'être titulaire du BEPC, CAP ou tout autre diplôme équivalent, et être âgé d’au moins 21 ans révolus' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, droit, économie, juridique, facultés, emploie, Certificat, formation, Bac, Professionnel, Professionnelle' });
    }


  
  
  ngOnInit(): void {
    
  }

}
