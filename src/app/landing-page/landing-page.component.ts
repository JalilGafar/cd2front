import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { SeoService } from '../service/seo.service';
import { WhatsappTrackingService } from '../service/whatsapp-tracking.service';
import { map, Observable } from 'rxjs';
import { TopNewsService } from '../service/top-news.service';
import { ActuListComponent } from '../actualite/components/actu-list/actu-list.component';
import { SchoolAdvers } from '../model/school-adv';
import { SchoolAdversComponent } from '../shared/components/school-advers/school-advers.component';
import { AdversService } from '../service/advers.service';
import { SharedComponentModule } from '../shared/shared.modules';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    ActuListComponent,
    SchoolAdversComponent,
    SharedComponentModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {

  schoolAdvers$!: Observable<SchoolAdvers[]>;
  counti = 0;
  private speed = 200;
  private count!: number;

  constructor(
    private service: TopNewsService,
    private adversService: AdversService,
    private titleService: Title,
    private meta: Meta,
    private seoService: SeoService,
    private whatsappTracking: WhatsappTrackingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seoService.setSeo({
      title:       'Formations Professionnelles au Cameroun | Camerdiplome',
      description: "Trouvez le diplôme et l'école de formation qui vous correspondent le mieux au Cameroun. Orientation gratuite, fiches écoles, métiers et diplômes.",
      url:         '/',
      image:       'https://www.camerdiplome.com/assets/images/home.webp',
      type:        'website',
      keywords:    'formation, professionnelle, ecoles, Cameroun, bts, licence, master, orientation'
    });

    this.seoService.setSchemaJsonLd({
      '@context': 'https://schema.org',
      '@type':    'WebSite',
      name:  'Camerdiplome',
      url:   'https://www.camerdiplome.com',
      description: "Spécialiste de l'orientation académique et professionnelle au Cameroun.",
      potentialAction: {
        '@type':       'SearchAction',
        target:        'https://www.camerdiplome.com/orientation/degree',
        'query-input': 'required name=search_term_string'
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.service.countFormation().pipe(
      map(data => {
        this.count = data[0].cont;
        const updateCount = () => {
          const current = +this.counti;
          const target = +this.count;
          const inc = target / this.speed;
          if (current < target) {
            this.counti = ~~(current + inc);
            setTimeout(updateCount, 1);
          } else {
            this.counti = target;
          }
        };
        updateCount();
      })
    ).subscribe();
  }

  discover(event?: Event): void {
    const msg = encodeURI('Bonjour, je souhaite référencer mon établissement sur Camerdiplome !');
    this.whatsappTracking.openWhatsapp(`https://wa.me/237676476096?text=${msg}`, event);
  }
}
