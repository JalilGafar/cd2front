import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { Observable } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';

@Component({
  selector: 'app-info-bachelor',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-bachelor.component.html',
  styleUrl: './info-bachelor.component.scss'
})
export class InfoBachelorComponent implements OnInit {

  titre = "Find your Bachelor's degree";
  soustitre = "Like Jules, 40% of high school graduates use Camerdiplome to find their school";
  photo = "./../../../../assets/images/pexels-kampus-productiont.webp";
  schoolAdvers$!: Observable<SchoolAdvers[]>;

  constructor( //private infoservice :InfoServices,
    private adversService: AdversService,
    private titleService:Title,
    @Inject(PLATFORM_ID) private platformId: Object) {this.titleService.setTitle("Le bac technique au Cameroun | Camerdiplome");}



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
