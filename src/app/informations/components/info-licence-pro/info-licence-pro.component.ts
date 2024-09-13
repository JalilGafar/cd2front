import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-licence-pro',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-licence-pro.component.html',
  styleUrl: './info-licence-pro.component.scss'
})
export class InfoLicenceProComponent implements OnInit {

  titre = "Trouvez votre Licence Pro";
  soustitre = "Comme Choupo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  constructor( //private infoservice :InfoServices,
    private titleService:Title,
    private meta : Meta) 
    {
      this.titleService.setTitle("La Licence Pro au Cameroun  | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Le Cycle licence Pro est une formation qui peut s\'intégrer directement après l\'obtention d\'un baccalauréat. '});
      this.meta.updateTag({ name: 'keywords', content: 'DUT, BTS IUT, Licence Pro, Master, formation, LMD '});

    }



  ngOnInit(): void {
    
  }

}
