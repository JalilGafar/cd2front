import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { interestelt } from '../../../model/interest-item-model';
import { Meta, Title } from '@angular/platform-browser';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdvers } from '../../../model/school-adv';

@Component({
  selector: 'app-info-licence',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-licence.component.html',
  styleUrl: './info-licence.component.scss'
})
export class InfoLicenceComponent implements OnInit {

  titre = "Trouvez votre licence";
  soustitre = "Comme Choupo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-rdne-stock-project.webp";
  school$!: Observable<interestelt[]>
  schoolAdvers$!: Observable<SchoolAdvers[]>;

  constructor( //private infoservice :InfoServices,
    private titleService:Title,
    private adversService: AdversService,
    private meta : Meta) 
    {
      this.titleService.setTitle("La Licence au Cameroun  | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Le Cycle licence est une formation qui peut s\'intégrer directement après l\'obtention d\'un baccalauréat. '});
      this.meta.updateTag({ name: 'keywords', content: 'DUT, BTS IUT, Licence, formation, LMD '});
    }


  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
