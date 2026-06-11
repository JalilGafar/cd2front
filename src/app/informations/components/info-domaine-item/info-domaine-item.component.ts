import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { Domaine } from '../../../admin/models/domaine.model';
import { ActivatedRoute, Router } from '@angular/router';
import { InfoServices } from '../../information.services';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { SchoolAdvers } from '../../../model/school-adv';
import { AdversService } from '../../../service/advers.service';
import { PubAdversComponent } from '../../../shared/components/pub-advers/pub-advers.component';
import { FormationAdvers } from '../../../model/formadv';
import { OrientationService } from '../../../orientation/orientation.service';
import { BEHAVIOR } from '../../../model/behavior';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-info-domaine-item',
  standalone: true,
  imports: [
    CommonModule,
    PubAdversComponent,
    SharedComponentModule
  ],
  templateUrl: './info-domaine-item.component.html',
  styleUrl: './info-domaine-item.component.scss'
})
export class InfoDomaineItemComponent implements OnInit {

  filiere!: Domaine[];
  advertiser$!: Observable<FormationAdvers[]>;


  constructor(
    private appRout: Router,
    private route: ActivatedRoute,
    private adversService: AdversService,
    private infoService: InfoServices,
    private orientationService: OrientationService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}


  private initSeo(): void {
    if (!this.filiere || !this.filiere[0]) {
      console.warn('InfoDomaineItemComponent.initSeo(): filiere data not available');
      return;
    }

    const domaine = this.filiere[0];
    const slug = this.route.snapshot.params['slug'] || '';
    const id = this.route.snapshot.params['id'] || domaine.id_dom;

    try {
      // Générer le titre (50-65 chars)
      let title = `${domaine.nom_dom} au Cameroun : formations, écoles et débouchés | Camerdiplome`;
      if (title.length > 65) {
        title = `${domaine.nom_dom} au Cameroun : écoles et formations`;
      }

      // Générer la description (150-160 chars)
      let description = `Découvrez les formations en ${domaine.nom_dom} au Cameroun : ${domaine.branche_dom ? domaine.branche_dom + ', ' : ''}écoles reconnues, diplômes, débouchés professionnels et conseils d'orientation.`;
      if (description.length > 160) {
        description = `Formations en ${domaine.nom_dom} au Cameroun : écoles reconnues, débouchés et insertion professionnelle. Trouvez votre formation.`;
      }

      // Construire l'URL
      const url = `/info/domaine/${slug}/${id}`;

      // Image
      let image = undefined;
      if (domaine.illustra_dom) {
        image = `https://www.camerdiplome.com/assets/images/domaine/${domaine.illustra_dom}`;
      }

      // Appeler le service SEO
      this.seoService.setSeo({
        title,
        description,
        url,
        image,
        type: 'article'
      });

      // Breadcrumb
      this.seoService.setJsonLd([
        { name: 'Accueil', url: '/', position: 1 },
        { name: 'Les domaines', url: '/info/diplome', position: 2 },
        { name: domaine.nom_dom, url, position: 3 }
      ]);
    } catch (error) {
      console.error('InfoDomaineItemComponent.initSeo() error:', error);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.route.params.pipe(
      switchMap(params => this.infoService.getFiliereById(+params['id'])),
      tap(filiere => this.filiere = filiere),
      tap(filiere => this.advertiser$ = this.adversService.getFormationPubByDom(filiere[0].id_dom)),
      tap(() => this.initSeo())
    ).subscribe()

  }

  trouverForm(){
    this.appRout.navigate(['./orientation/degree']);
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
