import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-dut',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-dut.component.html',
  styleUrl: './info-dut.component.scss'
})
export class InfoDutComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Fatima, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/fati_lon_mini.webp";

  constructor(
    private titleService:Title,
    private meta : Meta ) 
    {
      this.titleService.setTitle("Le DUT au Cameroun | Camerdiplome ");
      this.meta.updateTag({ name: 'description', content: 'Le Diplôme Universitaire de Technologie (DUT) se prépare dans un Institut Universitaire de Technologie (IUT)' });
      this.meta.updateTag({ name: 'keywords', content: 'DUT, BTS IUT, Diplôme Universitaire de Technologie, Institut Universitaire de Technologie, formation ' });
    }


  ngOnInit(): void {
    
  }

}
