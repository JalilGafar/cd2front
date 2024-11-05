import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';

@Component({
  selector: 'app-info-prepa',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-prepa.component.html',
  styleUrl: './info-prepa.component.scss'
})
export class InfoPrepaComponent implements OnInit {

  titre = "Prépa";
  soustitre = "Comme Dobo, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";
  schoolAdvers$!: Observable<SchoolAdvers[]>;


  constructor(
    private titleService:Title,
    private adversService: AdversService,
    private meta: Meta) 
    { 
      this.titleService.setTitle("Les Meilleurs Prépa au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Vous souhaitez facilement intégrer une grande école au Cameroun ou à l\'étranger ? Alors, le passage par une prépa est le moyen le plus sûr d\'atteindre votre objectif.' });
      this.meta.updateTag({ name: 'keywords', content: 'métier, metier, école, concours, grande école, emploie, Certificat, formation, Bac, Professionnel, Professionnelle'});
    }

  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
