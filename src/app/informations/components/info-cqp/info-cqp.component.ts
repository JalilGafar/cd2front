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
  selector: 'app-info-cqp',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-cqp.component.html',
  styleUrl: './info-cqp.component.scss'
})
export class InfoCqpComponent implements OnInit {

  titre = "Certificat de Qualification Professionnelle (CQP)";
  soustitre = "Comme Esso, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;


  constructor(
    private titleService:Title,
    private adversService: AdversService,
    private meta: Meta,
    @Inject(PLATFORM_ID) private platformId: Object)
    {
      this.titleService.setTitle("Le Certificat de Qualification Professionnelle (CQP) au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Le Certificat de Qualification Professionnelle (CQP)est une certification créée et délivrée par une branche professionnelle, via la Commission Paritaire Nationale de l’Emploi et de la Formation professionnelle.' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, emploie,Certificat, CQP, DQP, formation, Bac, Professionnel, Professionnelle, Technique' });
    }

  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
