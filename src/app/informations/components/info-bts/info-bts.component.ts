import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdvers } from '../../../model/school-adv';
import { Observable } from 'rxjs';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';

@Component({
  selector: 'app-info-bts',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-bts.component.html',
  styleUrl: './info-bts.component.scss'
})
export class InfoBtsComponent implements OnInit {

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
      this.titleService.setTitle("Liste des BTS | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'BTS signification, niveau, débouchés et listes des différents de BTS' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, BTS, Informatique, Infirmier, communication, emploie, formation, Bac, Professionnel, Professionnelle' });
    }



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.schoolAdvers$ = this.adversService.getSchoolPub();

  }

}
