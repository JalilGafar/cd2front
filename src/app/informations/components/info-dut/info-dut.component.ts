import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdvers } from '../../../model/school-adv';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info-dut',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-dut.component.html',
  styleUrl: './info-dut.component.scss'
})
export class InfoDutComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Fatima, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/fati_lon_mini.webp";
  schoolAdvers$!: Observable<SchoolAdvers[]>;
  
  constructor(
    private titleService:Title,
    private adversService: AdversService,
    private meta : Meta ) 
    {
      this.titleService.setTitle("Le DUT au Cameroun | Camerdiplome ");
      this.meta.updateTag({ name: 'description', content: 'Le Diplôme Universitaire de Technologie (DUT) se prépare dans un Institut Universitaire de Technologie (IUT)' });
      this.meta.updateTag({ name: 'keywords', content: 'DUT, BTS IUT, Diplôme Universitaire de Technologie, Institut Universitaire de Technologie, formation ' });
    }


  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
