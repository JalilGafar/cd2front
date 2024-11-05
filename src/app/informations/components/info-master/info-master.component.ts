import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { SchoolAdvers } from '../../../model/school-adv';
import { Observable } from 'rxjs';
import { AdversService } from '../../../service/advers.service';

@Component({
  selector: 'app-info-master',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-master.component.html',
  styleUrl: './info-master.component.scss'
})
export class InfoMasterComponent implements OnInit {

  titre = "Trouvez votre Master";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";
  schoolAdvers$!: Observable<SchoolAdvers[]>;

  constructor( //private infoservice :InfoServices,
    private titleService:Title,
    private adversService: AdversService,
    private meta : Meta) 
    {
      this.titleService.setTitle("Les Master au Cameroun  | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Le Cycle Master est une formation qui peut s\'intégrer directement après l\'obtention d\'une licence. '});
      this.meta.updateTag({ name: 'keywords', content: 'DUT, BTS IUT, Licence Pro, Master, formation, LMD '});

    }


  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
