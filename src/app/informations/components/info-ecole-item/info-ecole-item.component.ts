import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { filter, Observable, switchMap, tap } from 'rxjs';
import { Etablissement } from '../../../model/etablissement-model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { InfoServices } from '../../information.services';
import { PrimengModule } from '../../../shared/primeng.modules';
import { AvisService } from '../../../student-avis/avis.service';
import { Avis } from '../../../model/avis-model';
import { EcoleAvis } from '../../../model/ecole-avis-model';
import { AvisSingleComponent } from '../../../student-avis/components/avis-single/avis-single.component';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { FormationAdvers } from '../../../model/formadv';
import { AdversService } from '../../../service/advers.service';
import { Meta, Title } from '@angular/platform-browser';
import { Formus } from '../../../model/formus-model';
import { BEHAVIOR } from '../../../model/behavior';
import { SeoService } from '../../../service/seo.service';
import { WhatsappTrackingService } from '../../../service/whatsapp-tracking.service';

@Component({
  selector: 'app-info-ecole-item',
  standalone: true,
  imports: [
    CommonModule,
    PrimengModule,
    AvisSingleComponent,
    PubAdversComponent
  ],
  templateUrl: './info-ecole-item.component.html',
  styleUrl: './info-ecole-item.component.scss'
})
export class InfoEcoleItemComponent implements OnInit{

  loading$!: Observable<boolean>;
  ecole!: Etablissement[];
  imageArray!: string[];
  parrainArray!:string[];
  avisList$!: Observable<Avis[]>; 
  avisList!:Avis[];
  schoolNote$!: Observable<EcoleAvis[]>;
  note!: number;
  code!: number;
  advertiser$!: Observable<FormationAdvers[]>;
  formus$!: Observable<Formus[]>;
  categorie!: {nom_cat:string} [];
  leTitre!: string | null;

  constructor(
    private titleService:Title,
    private route: ActivatedRoute,
    private infoService: InfoServices,
    private avisService : AvisService,
    private adversService: AdversService,
    private appRout : Router,
    private meta : Meta,
    private seoService: SeoService,
    private whatsappTracking: WhatsappTrackingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  private initMetaForMyPage(){
    if (!this.ecole?.[0]) return;

    const ecole  = this.ecole[0];
    const slug   = this.route.snapshot.params['slug'] || '';
    const id     = this.route.snapshot.params['id']   || ecole.id_ecol;
    const url    = `/info/ecole/${slug}/${id}`;

    const title       = `${ecole.sigle_e} - ${ecole.nom_e} | Camerdiplome`;
    const description = `${ecole.nom_e} — établissement d'enseignement supérieur au Cameroun. `
                      + `${ecole.niveau_e ? 'Niveau ' + ecole.niveau_e + '. ' : ''}`
                      + `Formations, avis étudiants et conditions d'admission.`;

    const image = ecole.logo_e
      ? `https://www.camerdiplome.com/assets/logos/${ecole.logo_e}`
      : undefined;

    // ── OG + Twitter + canonical ──────────────────────────────────────────────
    this.seoService.setSeo({ title, description, url, image, type: 'website',
      keywords: `${ecole.sigle_e}, ${ecole.nom_e}, formation, Cameroun, orientation` });

    // ── JSON-LD EducationalOrganization ───────────────────────────────────────
    this.seoService.setSchemaJsonLd({
      '@context': 'https://schema.org',
      '@type':    'EducationalOrganization',
      name:            ecole.nom_e,
      alternateName:   ecole.sigle_e,
      url:             `https://www.camerdiplome.com${url}`,
      ...(image ? { logo: image } : {}),
      ...(ecole.descriptif_e ? { description: ecole.descriptif_e } : {}),
      ...(ecole.tel_1_e      ? { telephone:   ecole.tel_1_e }      : {}),
      ...(ecole.email_e      ? { email:       ecole.email_e }      : {}),
      ...(ecole.siteweb_e    ? { sameAs:      [ecole.siteweb_e] }  : {}),
      address: { '@type': 'PostalAddress', addressCountry: 'CM' }
    });

    // ── BreadcrumbList ────────────────────────────────────────────────────────
    this.seoService.setBreadcrumb([
      { name: 'Accueil',   url: '/',           position: 1 },
      { name: 'Les écoles', url: '/info/ecole', position: 2 },
      { name: ecole.nom_e, url,                position: 3 }
    ]);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    this.loading$ = this.infoService.loading$

    // this.route.params.pipe(
    //   switchMap(async (params) => this.titleService.setTitle(''+params['detail'])),
    //   // filter(event => event instanceof NavigationEnd),
    //   // tap(()=> this.titleService.setTitle(this.leTitre+''))
    // ).subscribe();

    // this.appRout.events.pipe(
       
    // ).subscribe()

    this.route.params.pipe(
      switchMap(params => this.infoService.getEcoleById(+params['id'])),
      tap(ecole=> this.ecole = ecole ),
      tap(ecole => this.imageArray = this.splitStringToArray(ecole[0].image_e)),
      tap(ecole => this.parrainArray = this.splitStringToArray(ecole[0].parrain))
    ).subscribe(()=> this.initMetaForMyPage());

    this.route.params.pipe(
      switchMap(params => this.avisService.getAvisForSchoolId(+params['id'])),
      tap(aviss=>this.avisList = aviss)
    ).subscribe();
    

    this.schoolNote$ = this.route.params.pipe(
      switchMap(params => this.avisService.getEcoleAvisById(+params['id'])),
      tap(ecole => this.note = Math.round(ecole[0].notes_moy)),
      tap(ecole => this.code = ecole[0].id_ecol),
    );
    
    this.advertiser$ = this.route.params.pipe(
      switchMap(params => this.adversService.getFormationPubForShool(+params['id'])),
    );

    this.infoService.getCateg().pipe(
      tap(data => this.categorie = data)
    ).subscribe();
    
    this.formus$ = this.route.params.pipe(
      switchMap(params => this.infoService.getFormusForShool(+params['id'])),
    );
  }

  ngAfterViewInit(): void {
      this.infoService.scrollTo('header', BEHAVIOR.auto)
  }

  trouverForm(){
    this.appRout.navigate(['./trouver-ma-formation']); 
  }

  discover(event?: Event){
    let c = encodeURI(`Je souhaite avoir plus d'information sur ${this.ecole[0].nom_e} ${this.ecole[0].sigle_e}`);
    let url = `https://wa.me/237676476096?text=${c}`
    this.whatsappTracking.openWhatsapp(url, event);
  }

  tonAvis(){
    this.appRout.navigateByUrl('avis/monAvis/'+ this.code);
  }

  splitStringToArray(str: string){
    if(str === null){
      str = ''
    }
    return str.split('').reduce((acc:string[], char:string) => {
      if (char ===' '){
        acc.push('');
      }else {
        acc[acc.length - 1] += char;
      } return acc;
    }, ['']);
  }

  

}
