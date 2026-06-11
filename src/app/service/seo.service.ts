import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

// ─── Interfaces publiques ──────────────────────────────────────────────────────

export interface SeoConfig {
  title:        string;
  description:  string;
  url:          string;
  image?:       string;
  type?:        string;     // default: 'website'
  keywords?:    string;
}

export interface BreadcrumbItem {
  name:     string;
  url:      string;
  position: number;
}

// ─────────────────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class SeoService {

  private readonly DEFAULT_IMAGE = 'https://www.camerdiplome.com/assets/images/home.webp';
  private readonly BASE_URL      = 'https://www.camerdiplome.com';
  private readonly SITE_NAME     = 'Camerdiplome';

  constructor(
    private titleService: Title,
    private metaService:  Meta,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  /**
   * Positionne tous les tags SEO d'une page :
   * title, meta description, Open Graph complet, Twitter Card, canonical.
   */
  setSeo(config: SeoConfig): void {
    if (!config.title || !config.description || !config.url) {
      console.error('[SeoService] setSeo — champs requis manquants :', config);
      return;
    }

    const title       = this.clean(config.title);
    const description = this.truncate(this.clean(config.description), 160);
    const image       = config.image || this.DEFAULT_IMAGE;
    const fullUrl     = this.BASE_URL + config.url;
    const type        = config.type || 'website';

    // ── Title & meta de base ──────────────────────────────────────────────────
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    if (config.keywords) {
      this.metaService.updateTag({ name: 'keywords', content: this.clean(config.keywords) });
    }

    // ── Open Graph ────────────────────────────────────────────────────────────
    this.metaService.updateTag({ property: 'og:site_name',   content: this.SITE_NAME });
    this.metaService.updateTag({ property: 'og:locale',      content: 'fr_CM' });
    this.metaService.updateTag({ property: 'og:type',        content: type });
    this.metaService.updateTag({ property: 'og:title',       content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:image',       content: image });
    this.metaService.updateTag({ property: 'og:url',         content: fullUrl });

    // ── Twitter Card ──────────────────────────────────────────────────────────
    this.metaService.updateTag({ name: 'twitter:card',        content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title',       content: title });
    this.metaService.updateTag({ name: 'twitter:description', content: description });
    this.metaService.updateTag({ name: 'twitter:image',       content: image });

    // ── Canonical ─────────────────────────────────────────────────────────────
    this.setCanonical(fullUrl);
  }

  /**
   * Injecte un schéma JSON-LD Schema.org générique dans le <head>.
   * @param schema Objet Schema.org complet (EducationalOrganization, Article, WebSite, Course…)
   * @param key    Clé unique permettant de remplacer un script existant (default: 'main')
   */
  setSchemaJsonLd(schema: Record<string, any>, key = 'main'): void {
    const attr = `data-seo-${key}`;

    const existing = this.doc.querySelector(`script[type="application/ld+json"][${attr}]`);
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(attr, '');
    script.textContent = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  /**
   * Injecte un BreadcrumbList JSON-LD.
   */
  setBreadcrumb(breadcrumbs: BreadcrumbItem[]): void {
    if (!breadcrumbs?.length) return;
    this.setSchemaJsonLd({
      '@context': 'https://schema.org',
      '@type':    'BreadcrumbList',
      itemListElement: breadcrumbs.map(item => ({
        '@type':    'ListItem',
        position:   item.position,
        name:       item.name,
        item:       this.BASE_URL + item.url
      }))
    }, 'breadcrumb');
  }

  /**
   * @deprecated Alias vers setBreadcrumb() — conservé pour compatibilité.
   * InfoDomaineItemComponent et InfoFormationItemComponent utilisent cette signature.
   */
  setJsonLd(breadcrumbs: BreadcrumbItem[]): void {
    this.setBreadcrumb(breadcrumbs);
  }

  // ─── Helpers privés ──────────────────────────────────────────────────────────

  private setCanonical(url: string): void {
    let link = this.doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private clean(text: string): string {
    if (!text) return '';
    return text.replace(/[\n\r]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  }

  private truncate(text: string, max: number): string {
    if (!text || text.length <= max) return text;
    return text.substring(0, max - 3).trimEnd() + '...';
  }
}
