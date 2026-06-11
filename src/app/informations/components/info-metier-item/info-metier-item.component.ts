import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Metier } from '../../../model/metier';
import { InfoServices } from '../../information.services';
import { CommonModule } from '@angular/common';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-info-metier-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './info-metier-item.component.html',
  styleUrl: './info-metier-item.component.scss'
})
export class InfoMetierItemComponent implements OnInit {

  metier$!: Observable<Metier>;
  metier!: Metier[];

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private generateSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private initSeo(): void {
    if (!this.metier || !this.metier[0]) {
      console.warn('InfoMetierItemComponent.initSeo(): metier data not available');
      return;
    }

    const metier = this.metier[0];
    const id     = this.route.snapshot.params['id'] || metier.id_metier;
    // URL canonique : toujours la forme slug/id, même si l'ancienne URL /:id a été visitée
    const slug   = this.route.snapshot.params['slug'] || this.generateSlug(metier.titre);
    const url    = `/info/metier/${slug}/${id}`;

    try {
      let title = `${metier.titre} au Cameroun : missions, formation et salaire | Camerdiplome`;
      if (title.length > 65) {
        title = `${metier.titre} au Cameroun : formations et débouchés`;
      }

      let description = `Tout savoir sur le métier de ${metier.titre} au Cameroun : missions, formations nécessaires, écoles, salaire moyen et perspectives d'évolution.`;
      if (description.length > 160) {
        description = `Le métier de ${metier.titre} au Cameroun : missions, formations, écoles et débouchés professionnels. Guide complet d'orientation.`;
      }

      let image = undefined;
      if (metier.image_me) {
        image = `https://www.camerdiplome.com/assets/images/metier/${metier.image_me}`;
      }

      this.seoService.setSeo({ title, description, url, image, type: 'article' });

      this.seoService.setJsonLd([
        { name: 'Accueil',     url: '/',            position: 1 },
        { name: 'Les métiers', url: '/info/metier', position: 2 },
        { name: metier.titre,  url,                 position: 3 }
      ]);
    } catch (error) {
      console.error('InfoMetierItemComponent.initSeo() error:', error);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.route.params.pipe(
      switchMap(params => this.infoService.getMetierById(+params['id'])),
      tap(metier => this.metier = metier),
      tap(() => this.initSeo())
    ).subscribe();
  }

}
