import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { SchoolAdvers } from '../../../model/school-adv';
import { Observable } from 'rxjs';
import { AdversService } from '../../../service/advers.service';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';

@Component({
  selector: 'app-info-capacite',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-capacite.component.html',
  styleUrl: './info-capacite.component.scss'
})
export class InfoCapaciteComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Stefi, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;


  constructor(
    private titleService:Title,
    private adversService: AdversService,
    private meta : Meta,
    @Inject(PLATFORM_ID) private platformId: Object)
    {
      this.titleService.setTitle("Capacité en Droit et Économie au Cameroun | Camerdiplome ");
      this.meta.updateTag({ name: 'description', content: 'La capacité en droit et Économie offre une formation universitaire juridique générale à tous publics avec pour condition d\'être titulaire du BEPC, CAP ou tout autre diplôme équivalent, et être âgé d’au moins 21 ans révolus' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, droit, économie, juridique, facultés, emploie, Certificat, formation, Bac, Professionnel, Professionnelle' });
    }


  
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
