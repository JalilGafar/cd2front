import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Actualite } from '../../../model/actualite';
import { Observable } from 'rxjs';
import { ActuService } from '../../actu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { OrientationService } from '../../../orientation/orientation.service';
import { BEHAVIOR } from '../../../model/behavior';
import { SeoService } from '../../../service/seo.service';

@Component({
  selector: 'app-single-actu',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './single-actu.component.html',
  styleUrl: './single-actu.component.scss'
})
export class SingleActuComponent implements OnInit {

  actualite!: Actualite;
  actualite$!: Observable<Actualite[]>
  buttonText!: string;

  constructor(
    private ActuService: ActuService,
    private route: ActivatedRoute,
    private appRout : Router,
    private meta : Meta,
    private titleService:Title,
    private orientationService :OrientationService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){}

  private initMetaForMyPage(){
    if (!this.actualite) return;

    const a       = this.actualite;
    const subject = this.route.snapshot.params['subject'] || a.sujets;
    const url     = `/actualite/blog/${subject}`;

    const image = a.illustration
      ? `https://www.camerdiplome.com/assets/images/article/${a.illustration}.webp`
      : undefined;

    // ── OG + Twitter + canonical ──────────────────────────────────────────────
    this.seoService.setSeo({
      title:       a.title + ' | Camerdiplome',
      description: a.summary,
      url,
      image,
      type:     'article',
      keywords: a.keywords + ', Orientation, Cameroun, Formation professionnelle'
    });

    // ── JSON-LD Article ───────────────────────────────────────────────────────
    this.seoService.setSchemaJsonLd({
      '@context': 'https://schema.org',
      '@type':    'Article',
      headline:        a.title,
      description:     a.summary,
      ...(image ? { image } : {}),
      datePublished:   a.createdDate,
      author:  { '@type': 'Organization', name: 'Camerdiplome',
                  url: 'https://www.camerdiplome.com' },
      publisher: { '@type': 'Organization', name: 'Camerdiplome',
                    url: 'https://www.camerdiplome.com' },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.camerdiplome.com${url}` }
    });

    // ── BreadcrumbList ────────────────────────────────────────────────────────
    this.seoService.setBreadcrumb([
      { name: 'Accueil',    url: '/',                 position: 1 },
      { name: 'Actualités', url: '/actualite/actues', position: 2 },
      { name: a.title,      url,                      position: 3 }
    ]);
  }

  ngOnInit(){
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    //this.buttonText = 'Oh Snap !';
    const actuSubject = this.route.snapshot.params['subject'];
    console.log(actuSubject);
    this.actualite$ = this.ActuService.getActualiteBySubject(actuSubject);
    this.actualite$.subscribe(actu=> {
      this.actualite = actu[0]
      this.initMetaForMyPage()
    })
  } 

  ngAfterViewInit(): void {
      this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }
  
  trouverForm(){
    this.appRout.navigate(['./orientation/degree']);
  }

}
