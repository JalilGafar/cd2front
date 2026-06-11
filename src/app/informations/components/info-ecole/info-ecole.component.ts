import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { filter, map, Observable, tap } from 'rxjs';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { EcoleFind } from '../../../model/ecoleFind-model';
import { InfoServices } from '../../information.services';
import { FormControl, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { event } from 'jquery';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-info-ecole',
  standalone: true,
  imports: [
    SharedComponentModule,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-ecole.component.html',
  styleUrl: './info-ecole.component.scss'
})
export class InfoEcoleComponent implements OnInit {

  titre = "Les établissements au Cameroun";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  schoolAdvers$!: Observable<SchoolAdvers[]>;
  ecole$!: Observable<EcoleFind[]>;
  ecole!: EcoleFind[];
  countEcole: number = 0;
  loading$!: Observable<boolean>;
  absent: string = 'absent-off'
  ets = new FormControl('', Validators.required)
  etsi: FormControl = new FormControl('', Validators.required)
  constructor(
    private titleService: Title,
    private meta: Meta,
    private adversService: AdversService,
    private infoService: InfoServices,
    private appRout: Router,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private initSeo(): void {
    try {
      this.seoService.setSeo({
        title: 'Les écoles au Cameroun | Annuaire complet | Camerdiplome',
        description: 'Découvrez toutes les écoles au Cameroun : universités, grandes écoles, instituts de formation. Trouvez l\'établissement qui correspond à vos aspirations avec Camerdiplome.',
        url: '/info/ecole',
        type: 'website'
      });

      // Breadcrumb pour la page de liste
      this.seoService.setJsonLd([
        { name: 'Accueil', url: '/', position: 1 },
        { name: 'Les écoles', url: '/info/ecole', position: 2 }
      ]);
    } catch (error) {
      console.error('InfoEcoleComponent.initSeo() error:', error);
    }
  }



  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.initSeo();

    this.loading$ = this.infoService.loading$

    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.ecole$ = this.infoService.getEcoleFind().pipe(
      tap(data => this.countEcole = data.length),
      tap(data => this.ecole = data),
      map(data => data.map(data => ({
        ...data,
        displayName: data.sigle_e + '   ' + data.nom_e + ' ||' + data.id_ecol
      })))
    );
  }

  onFind() {
    if (this.ets.invalid) {
      return;
    } else if (this.ets.value != null) {
      console.log(this.ets)
      // this.appRout.navigate(['info/ecole/'+ this.ets.value] , {queryParams:{detail: paramsValue}})  

      let tt = parseInt(this.ets.value[this.ets.value.indexOf("||") + 2] + this.ets.value[this.ets.value?.indexOf("||") + 3] + this.ets.value[this.ets.value?.indexOf("||") + 4])
      if (isNaN(tt)) {
        this.absent = 'absent-on'
      } else {
        // this.appRout.navigateByUrl('info/ecole/'+ tt+'', {details:});   
        const slug = this.generateSlug(this.ets.value); // ou phone.nom si c’est ça le champ réel
        this.appRout.navigate(['info/ecole', slug, tt]);
        // let paramsValue = this.ets.value.split(' ').join('_').toLowerCase()
        // this.appRout.navigate(['info/ecole/'+ tt] , {queryParams:{detail: paramsValue}})                                            
      }
    }
  }

  generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')                   // décompose les lettres accentuées
      .replace(/[\u0300-\u036f]/g, '')    // supprime les signes diacritiques (accents)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')        // remplace les caractères spéciaux par des -
      .replace(/^-+|-+$/g, '');           // enlève les - au début et à la fin
  }

  hiden() {
    this.absent = 'absent-off'
  }

}
