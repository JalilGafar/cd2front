import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../service/seo.service';

@Component({
  selector: 'app-condition',
  standalone: true,
  imports: [],
  templateUrl: './condition.component.html',
  styleUrl: './condition.component.scss'
})
export class ConditionComponent implements OnInit {

  constructor(
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seoService.setSeo({
      title:       "Conditions générales d'utilisation | Camerdiplome",
      description: "Conditions générales d'utilisation de la plateforme Camerdiplome : règles d'accès, droits et obligations des utilisateurs et des établissements partenaires.",
      url:         '/condition',
      type:        'website'
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
