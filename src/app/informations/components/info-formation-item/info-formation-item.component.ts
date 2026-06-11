import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Formation } from '../../../admin/models/formation.model';
import { ActivatedRoute } from '@angular/router';
import { InfoServices } from '../../information.services';
import { switchMap, tap } from 'rxjs';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-info-formation-item',
  standalone: true,
  imports: [],
  templateUrl: './info-formation-item.component.html',
  styleUrl: './info-formation-item.component.scss'
})
export class InfoFormationItemComponent implements OnInit {

  formation!: Formation[];

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private initSeo(): void {
    if (!this.formation || !this.formation[0]) {
      console.warn('InfoFormationItemComponent.initSeo(): formation data not available');
      return;
    }

    const formation = this.formation[0];
    const id = this.route.snapshot.params['id'] || formation.id_form;

    try {
      // Générer le titre (50-65 chars)
      let title = `${formation.nom_f} - ${formation.nom_e} | Camerdiplome`;
      if (title.length > 65) {
        title = `${formation.nom_f} | Camerdiplome`;
      }

      // Générer la description (150-160 chars)
      let description = `Formation ${formation.nom_f} à ${formation.nom_e}${formation.ville_cam ? ' (' + formation.ville_cam + ')' : ''}. ${formation.nom_dip}, durée ${formation.duree_f}${formation.cout_f ? ', à partir de ' + formation.cout_f + ' FCFA' : ''}. Conditions d'admission et inscription.`;
      if (description.length > 160) {
        description = `${formation.nom_f} à ${formation.nom_e} (${formation.nom_dip}). Durée : ${formation.duree_f}. Conditions d'admission et inscription en ligne.`;
      }

      // Construire l'URL
      const url = `/info/formation/${id}`;

      // Image (logo de l'école si dispo)
      let image = undefined;
      // Note: Le modèle Formation n'a pas d'image directe, on pourrait utiliser un logo par défaut d'école
      // Pour l'instant, laisser undefined pour utiliser l'image par défaut du SeoService

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
        { name: formation.nom_e, url: `/info/ecole/${formation.ecole_f_id}`, position: 2 },
        { name: formation.nom_f, url, position: 3 }
      ]);
    } catch (error) {
      console.error('InfoFormationItemComponent.initSeo() error:', error);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.route.params.pipe(
      switchMap(params => this.infoService.getFormationById(+params['id'])),
      tap(formation => this.formation = formation),
      tap(() => this.initSeo())
    ).subscribe();
  }
}
