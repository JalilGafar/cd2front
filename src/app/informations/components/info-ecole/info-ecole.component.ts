import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { map, Observable, tap } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { EcoleFind } from '../../../model/ecoleFind-model';
import { InfoServices } from '../../information.services';

@Component({
  selector: 'app-info-ecole',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent
  ],
  templateUrl: './info-ecole.component.html',
  styleUrl: './info-ecole.component.scss'
})
export class InfoEcoleComponent implements OnInit{

  titre = "Les établissements au Cameroun";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;
  ecole$!: Observable<EcoleFind[]>;
  countEcole!: number;
  
  constructor( //private infoservice :InfoServices,
    private titleService:Title,
    private adversService: AdversService,
    private infoService: InfoServices
  ) 
    {
      this.titleService.setTitle("Les Ecoles de formation au Cameroun | Camerdiplome");
    }



  ngOnInit(): void {
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.ecole$ = this.infoService.getEcoleFind().pipe(
      tap(data => this.countEcole = data.length ),
      map(data => data.map(data => ({
        ...data,
        displayName : data.sigle_e+' || '+data.nom_e
      })))
    ) ;
  }

  onFind(){

  }

}
