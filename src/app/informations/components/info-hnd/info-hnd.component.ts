import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';

@Component({
  selector: 'app-info-hnd',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-hnd.component.html',
  styleUrl: './info-hnd.component.scss'
})
export class InfoHndComponent implements OnInit {

  titre = "Find your training";
  soustitre = "Like Stefi, 40% of high school graduates use Camerdiplome to find their school";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";
  schoolAdvers$!: Observable<SchoolAdvers[]>;

  constructor( 
    private adversService: AdversService,
    private titleService:Title) {this.titleService.setTitle("The Higher National Diploma (HND)  in Cameroon  | Camerdiplome");}



  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
  }

}
