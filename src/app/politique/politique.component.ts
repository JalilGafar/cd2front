import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../service/seo.service';

@Component({
  selector: 'app-politique',
  standalone: true,
  imports: [],
  templateUrl: './politique.component.html',
  styleUrl: './politique.component.scss'
})
export class PolitiqueComponent implements OnInit {

  constructor(
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seoService.setSeo({
      title:       'Politique de confidentialité | Camerdiplome',
      description: "Politique de confidentialité de Camerdiplome : collecte, traitement et protection de vos données personnelles conformément à la réglementation en vigueur.",
      url:         '/politique',
      type:        'website'
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
