import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Router } from '@angular/router';
import { interestelt } from '../../../model/interest-item-model';
import { Observable, tap } from 'rxjs';
import { InfoServices } from '../../information.services';
import { CommonModule } from '@angular/common';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { AdversService } from '../../../service/advers.service';
import { FormationAdvers } from '../../../model/formadv';
import { SchoolAdversComponent } from '../../../shared/components/school-advers/school-advers.component';
import { SchoolAdvers } from '../../../model/school-adv';
import { ActuListComponent } from '../../../actualite/components/actu-list/actu-list.component';
import { SeoService } from '../../../service/seo.service';
import { WhatsappTrackingService } from '../../../service/whatsapp-tracking.service';


@Component({
  selector: 'app-info-metier',
  standalone: true,
  imports: [
    SharedComponentModule,
    PubAdversComponent,
    SchoolAdversComponent,
    ActuListComponent
  ],
  templateUrl: './info-metier.component.html',
  styleUrl: './info-metier.component.scss'
})
export class InfoMetierComponent implements OnInit{

  titre = "Un Métier qui te correspond";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../assets/images/pexels-3.webp";

  advertiser$!: Observable<FormationAdvers[]>;
  schoolAdvers$!: Observable<SchoolAdvers[]>
  metierListe$!: Observable<[{id_metier:number, titre:string}]>;
  metierTransit: {id_metier:number, titre:string}[] = []; 
  metierLong: {id_metier:number, titre:string}[] = []; 
  metierShort: {id_metier:number, titre:string}[] = []; 

  plusMetiertext = 'Voir plus de métier'

  schoolAdvers = ['vrai', 'faux', 'orange', 'noir']

  // school$!: Observable <interestelt[]>;


  constructor(
    private appRout: Router,
    private adversService: AdversService,
    private infoService: InfoServices,
    private seoService: SeoService,
    private whatsappTracking: WhatsappTrackingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  contacterWhatsapp(event: Event): void {
    this.whatsappTracking.openWhatsapp('https://wa.me/237676476096', event);
  }
    

  private initMetaForMyPage(): void {
    try {
      this.seoService.setSeo({
        title: "Les Métiers d'avenir au Cameroun | Camerdiplome",
        description: 'Découvrez les métiers d\'avenir au Cameroun. Explorez les différents domaines professionnels, formations nécessaires et débouchés pour trouver la carrière qui vous correspond.',
        url: '/info/metier',
        type: 'website',
        keywords: 'métiers, professions, carrière, avenir, Cameroun, domaine professionnel, orientation professionnelle'
      });

      // Breadcrumb pour la page de liste
      this.seoService.setJsonLd([
        { name: 'Accueil', url: '/', position: 1 },
        { name: 'Les métiers', url: '/info/metier', position: 2 }
      ]);
    } catch (error) {
      console.error('InfoMetierComponent.initMetaForMyPage() error:', error);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.initMetaForMyPage();
    this.advertiser$ = this.adversService.getFormationPub();
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.infoService.getMetierLongList().pipe(
      tap( data => {
        this.metierLong = data
        for (let index = 0; index < 8; index++) {
          this.metierShort.push(data[index])
        }
        this.metierTransit = this.metierShort
      } )
    ).subscribe();

    // $('.collapse').on('show.bs.collapse', function(e){
    //   var $card = $(this).closest('.card');
    //   $('html,body').animate({
    //     scrollTop: $card.offset()?.top
    //   }, 500)
    // });
  }



  plusMetier(){
    if (this.plusMetiertext == 'Voir plus de métier') {      
      this.metierTransit = this.metierLong;
      this.plusMetiertext = 'Voir moins'
    } else {
      this.metierTransit = this.metierShort;
      this.plusMetiertext = 'Voir plus de métier'
    }
  }

  generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  metier(idMetier: number, titre: string): void {
    const s = this.generateSlug(titre);
    this.appRout.navigate(['info/metier', s, idMetier]);
  }

  

}
