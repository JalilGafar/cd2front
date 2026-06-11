import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  animate,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { environment } from '../../environments/environment';

// ── Interfaces locales au composant ─────────────────────────────────────────

interface Ville {
  ville_cam: string;
}

interface Domaine {
  id_dom: number;
  nom_dom: string;
  branche_dom: string;
  illustra_dom: string | null;
  parent_id:   number | null;
  nom_parent:  string | null;
}

interface DomaineGroupe {
  parent_id:    number;
  nom_parent:   string;
  sousDomaines: Domaine[];
}

interface ResultatFormation {
  nom_dip: string;
  nom_cat: string;
  id_ecol: number;
  nom_e: string;
  groupe: string;
  sigle_e: string;
  ville_cam: string;
  id_form: number;
  date_debut_f: string;
  cout_f: string;
  logo_e: string;
  descriptif_dip: string;
  descriptif_f: string;
  tel_1_e: string;
  email_e: string;
  siteweb_e: string;
  conditions_f: string;
  descriptif_e: string;
}

interface OptionSelect {
  label: string;
  value: string;
}

type Phase = 'A' | 'B' | 'C';

// ── Constantes ───────────────────────────────────────────────────────────────

const VILLES_COURANTES: string[] = [
  'Yaoundé', 'Douala', 'Bafoussam', 'Bamenda', 'Ngaoundéré', 'Garoua',
];

const ICONES_PARENT: Record<string, string> = {
  'Agriculture & Environnement':       'bi-tree',
  'Energie & Génie Industriel':        'bi-lightning-charge',
  'Génie Civil & BTP':                 'bi-building',
  'Génie Electrique & Electronique':   'bi-plug',
  'Chimie, Mines & Géosciences':       'bi-gem',
  'Informatique & Numérique':          'bi-laptop',
  'Gestion, Commerce & Transport':     'bi-briefcase',
  'Finance, Banque & Comptabilité':    'bi-cash-stack',
  'Droit, Fiscalité & Sc. Politiques': 'bi-scale',
  'Santé & Paramédical':               'bi-heart-pulse-fill',
  'Communication & Médias':            'bi-megaphone',
  'Arts, Culture & Design':            'bi-palette',
  'Tourisme, Hôtellerie & Bien-être':  'bi-airplane',
  'Langues & Lettres':                 'bi-translate',
  'Sciences Humaines & Sociales':      'bi-people',
};

const ICONES_BRANCHE: Record<string, string> = {
  'Agriculture, Environnement':   'bi-tree',
  'Art, Culture, Design, Mode':   'bi-palette',
  'Bien-être, Beauté':            'bi-stars',
  'Commerce, management':         'bi-briefcase',
  'Droit, Sc. Politiques':        'bi-scale',
  'Finance, comptabilité':        'bi-cash-stack',
  'Fonction publique':            'bi-building',
  'Hôtellerie, tourisme':         'bi-airplane',
  'Image, son, animation 2D/3D':  'bi-camera-video',
  'Informatique':                  'bi-laptop',
  'Ingénierie, Science':           'bi-gear',
  'Langues et Sc. humaines':      'bi-translate',
  'Marketing, communication':     'bi-megaphone',
  'santé':                         'bi-heart-pulse-fill',
  'Sport, social, animation':     'bi-trophy',
};

// ── Animations ───────────────────────────────────────────────────────────────

const fadeSlideIn = trigger('fadeSlideIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(32px)' }),
    animate('350ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

const staggerIn = trigger('staggerIn', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(24px)' }),
      stagger(55, [
        animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
]);

const leadCardIn = trigger('leadCardIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.94) translateY(20px)' }),
    animate('350ms 150ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
  ]),
]);

const successBannerIn = trigger('successBannerIn', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-12px)' }),
    animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

const backdropIn = trigger('backdropIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms ease', style({ opacity: 0 })),
  ]),
]);

const modalPanelIn = trigger('modalPanelIn', [
  transition(':enter', [
    style({ transform: 'translateY(100%)' }),
    animate('320ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    animate('250ms cubic-bezier(0.4, 0, 0.2, 1)', style({ transform: 'translateY(100%)' })),
  ]),
]);

// ── Composant ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-orientation-v2',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, ProgressSpinnerModule, NgxIntlTelInputModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './orientation-v2.component.html',
  styleUrl: './orientation-v2.component.scss',
  animations: [fadeSlideIn, staggerIn, leadCardIn, successBannerIn, backdropIn, modalPanelIn],
})
export class OrientationV2Component implements OnInit {
  private readonly http    = inject(HttpClient);
  private readonly cdr     = inject(ChangeDetectorRef);
  private readonly router  = inject(Router);
  private readonly apiBase = environment.apiUrl;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // ── État des phases ──────────────────────────────────────────────────
  phase: Phase = 'A';

  // ── Phase A : Ville ──────────────────────────────────────────────────
  readonly villesCourantes = VILLES_COURANTES;
  villes: Ville[]          = [];
  villeRecherche           = '';
  villeSelectionnee        = '';
  afficherToutesVilles     = false;

  // ── Phase B : Domaine ─────────────────────────────────────────────────
  domaines: Domaine[]        = [];
  domaineRecherche           = '';
  domaineSelectionne: Domaine | null = null;
  tousDomainesSelectionnes   = false;

  // ── Phase C : Résultats ───────────────────────────────────────────────
  resultats: ResultatFormation[]       = [];
  resultatsFiltres: ResultatFormation[] = [];
  diplomesOptions: OptionSelect[]      = [];
  diplomeFiltre: OptionSelect | null   = null;

  // ── Lead capture ──────────────────────────────────────────────────────
  leadSoumis     = false;
  leadChargement = false;
  leadPrenom     = '';
  leadTelObj: any = null;
  leadEmail      = '';

  // ── Filtre bloqué (tentative de filtre avant soumission lead) ─────────
  filtreBloque = false;

  // ── Pagination (active après soumission lead) ─────────────────────────
  pageActuelle      = 1;
  readonly pageSize = 10;

  // ── Modal détail formation ────────────────────────────────────────────
  formationSelectionnee: ResultatFormation | null = null;

  // ── États transversaux ────────────────────────────────────────────────
  chargement = false;
  erreur: string | null = null;

  // ── Getters : listes filtrées côté client ────────────────────────────

  get villesFiltrees(): Ville[] {
    if (!this.villeRecherche.trim()) return this.villes;
    const q = this.villeRecherche.toLowerCase();
    return this.villes.filter(v => v.ville_cam.toLowerCase().includes(q));
  }

  get domainesFiltres(): Domaine[] {
    if (!this.domaineRecherche.trim()) return this.domaines;
    const q = this.domaineRecherche.toLowerCase();
    return this.domaines.filter(d =>
      d.nom_dom.toLowerCase().includes(q) ||
      (d.nom_parent ?? '').toLowerCase().includes(q) ||
      (d.branche_dom ?? '').toLowerCase().includes(q)
    );
  }

  get domainesGroupes(): DomaineGroupe[] {
    const map = new Map<number, DomaineGroupe>();
    for (const d of this.domaines) {
      if (d.parent_id == null) continue;
      if (!map.has(d.parent_id)) {
        map.set(d.parent_id, {
          parent_id:    d.parent_id,
          nom_parent:   d.nom_parent ?? '',
          sousDomaines: [],
        });
      }
      map.get(d.parent_id)!.sousDomaines.push(d);
    }
    return Array.from(map.values()).sort((a, b) =>
      a.nom_parent.localeCompare(b.nom_parent, 'fr')
    );
  }

  get cartesVisibles(): ResultatFormation[] {
    return this.resultatsFiltres.slice(0, 3);
  }

  get cartesFantomes(): ResultatFormation[] {
    return this.resultatsFiltres.slice(3, 5);
  }

  get cartesDebloquees(): ResultatFormation[] {
    return this.resultatsFiltres.slice(3);
  }

  get nombreRestants(): number {
    return Math.max(0, this.resultatsFiltres.length - 3);
  }

  get afficherFormulaireLead(): boolean {
    return this.resultatsFiltres.length > 3 && !this.leadSoumis;
  }

  // ── Pagination ────────────────────────────────────────────────────────

  get cartesPage(): ResultatFormation[] {
    const debut = (this.pageActuelle - 1) * this.pageSize;
    return this.resultatsFiltres.slice(debut, debut + this.pageSize);
  }

  get nombrePages(): number {
    return Math.ceil(this.resultatsFiltres.length / this.pageSize);
  }

  get pagesVisibles(): (number | '...')[] {
    const total = this.nombrePages;
    const cur   = this.pageActuelle;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1];
    if (cur > 3) pages.push('...');
    for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i);
    if (cur < total - 2) pages.push('...');
    pages.push(total);
    return pages;
  }

  allerPage(page: number): void {
    if (page < 1 || page > this.nombrePages) return;
    this.pageActuelle = page;
    this.scrollVersHautResultats();
    this.cdr.markForCheck();
  }

  private scrollVersHautResultats(): void {
    if (typeof document !== 'undefined') {
      document.getElementById('resultats-contenu')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ── Lifecycle ────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.chargerVilles();
    if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
  }

  // ── Phase A ──────────────────────────────────────────────────────────

  chargerVilles(): void {
    this.chargement = true;
    this.http.get<Ville[]>(`${this.apiBase}/api/cyties`).subscribe({
      next: (data) => {
        this.villes     = data;
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.chargement = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectionnerVille(ville: string): void {
    this.villeSelectionnee = ville;
    this.phase             = 'B';
    if (this.domaines.length === 0) {
      this.chargerDomaines();
    }
    this.cdr.markForCheck();
  }

  // ── Phase B ──────────────────────────────────────────────────────────

  chargerDomaines(): void {
    this.chargement = true;
    this.http.get<Domaine[]>(`${this.apiBase}/api/field/page`).subscribe({
      next: (data) => {
        this.domaines   = data;
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.chargement = false;
        this.cdr.markForCheck();
      },
    });
  }

  selectionnerDomaine(domaine: Domaine): void {
    this.domaineSelectionne        = domaine;
    this.tousDomainesSelectionnes  = false;
    this.phase                     = 'C';
    this.chargerResultats();
    this.cdr.markForCheck();
  }

  selectionnerTousDomaines(): void {
    this.domaineSelectionne        = null;
    this.tousDomainesSelectionnes  = true;
    this.phase                     = 'C';
    this.chargerResultats();
    this.cdr.markForCheck();
  }

  // ── Phase C ──────────────────────────────────────────────────────────

  chargerResultats(): void {
    if (!this.domaineSelectionne && !this.tousDomainesSelectionnes) return;
    this.chargement      = true;
    this.erreur          = null;
    this.resultats       = [];
    this.resultatsFiltres = [];

    const params = {
      city:    this.villeSelectionnee,
      diplome: '',
      domaine: this.tousDomainesSelectionnes ? '' : this.domaineSelectionne!.id_dom.toString(),
      branche: this.tousDomainesSelectionnes ? '' : this.domaineSelectionne!.branche_dom,
    };

    this.http.get<ResultatFormation[]>(`${this.apiBase}/api/result`, { params }).subscribe({
      next: (data) => {
        this.resultats = data;
        this.construireFiltresDiplomes();
        this.appliquerFiltreDiplome();
        this.chargement = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erreur     = 'Une erreur est survenue lors du chargement des résultats.';
        this.chargement = false;
        this.cdr.markForCheck();
      },
    });
  }

  private construireFiltresDiplomes(): void {
    const cats = [...new Set(this.resultats.map(r => r.nom_cat))].filter(Boolean).sort();
    this.diplomesOptions = [
      { label: 'Tous les niveaux', value: '' },
      ...cats.map(c => ({ label: c, value: c })),
    ];
    this.diplomeFiltre = this.diplomesOptions[0];
  }

  appliquerFiltreDiplome(): void {
    // Bloquer le filtre si le lead n'est pas soumis et qu'il y a des cartes verrouillées
    if (this.nombreRestants > 0 && !this.leadSoumis && this.diplomeFiltre?.value) {
      this.diplomeFiltre = this.diplomesOptions[0]; // réinitialiser à "Tous les niveaux"
      this.filtreBloque  = true;
      this.scrollVersFormulaireLead();
      setTimeout(() => {
        this.filtreBloque = false;
        this.cdr.markForCheck();
      }, 2500);
      this.cdr.markForCheck();
      return;
    }
    const valeur          = this.diplomeFiltre?.value ?? '';
    this.resultatsFiltres = valeur
      ? this.resultats.filter(r => r.nom_cat === valeur)
      : [...this.resultats];
    this.pageActuelle = 1;
    this.cdr.markForCheck();
  }

  private scrollVersFormulaireLead(): void {
    if (typeof document !== 'undefined') {
      document.getElementById('carte-lead')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  nouvelleRecherche(): void {
    this.phase             = 'A';
    this.villeSelectionnee = '';
    this.villeRecherche    = '';
    this.domaineSelectionne = null;
    this.domaineRecherche  = '';
    this.resultats         = [];
    this.resultatsFiltres  = [];
    this.diplomesOptions   = [];
    this.diplomeFiltre     = null;
    this.leadSoumis        = false;
    this.leadPrenom        = '';
    this.leadTelObj        = null;
    this.leadEmail         = '';
    this.filtreBloque      = false;
    this.pageActuelle      = 1;
    this.erreur                   = null;
    this.afficherToutesVilles     = false;
    this.tousDomainesSelectionnes = false;
    this.cdr.markForCheck();
  }

  // ── Lead capture ──────────────────────────────────────────────────────

  soumettreLead(): void {
    if (!this.leadPrenom.trim() || !this.leadTelObj) return;
    this.leadChargement = true;

    const payload = {
      name:     '',
      surname:  this.leadPrenom.trim(),
      statuts:  '',
      level:    '',
      bornDate: 0,
      email:    this.leadEmail.trim(),
      tel:      this.leadTelObj?.e164Number ?? this.leadTelObj?.internationalNumber ?? '',
      country:  '',
      city:     this.villeSelectionnee,
      degree:   '',
      field:    this.domaineSelectionne?.nom_dom ?? '',
    };

    this.http.post(`${this.apiBase}/api/result`, payload).subscribe({
      next:  () => this.debloquerApresLead(),
      // En cas d'erreur réseau on débloque quand même pour ne pas bloquer l'utilisateur
      error: () => this.debloquerApresLead(),
    });
  }

  private debloquerApresLead(): void {
    this.leadSoumis     = true;
    this.leadChargement = false;
    this.pageActuelle   = 1;
    this.cdr.markForCheck();
  }

  // ── Modal détail ──────────────────────────────────────────────────────

  ouvrirDetail(r: ResultatFormation): void {
    this.formationSelectionnee = r;
    if (typeof document !== 'undefined') document.body.style.overflow = 'hidden';
    this.cdr.markForCheck();
  }

  fermerDetail(): void {
    this.formationSelectionnee = null;
    if (typeof document !== 'undefined') document.body.style.overflow = '';
    this.cdr.markForCheck();
  }

  contacterConseiller(r: ResultatFormation): void {
    if (typeof window === 'undefined') return;
    const msg = encodeURIComponent(
      `Bonjour, je souhaite avoir plus d'informations sur le diplôme "${r.nom_dip}" ` +
      `à l'école ${r.sigle_e || r.nom_e} dans la ville de ${r.ville_cam}.`
    );
    window.open(`https://wa.me/237679197112?text=${msg}`, '_blank', 'noopener,noreferrer');
  }

  allerEcole(r: ResultatFormation): void {
    const slug = this.genererSlug((r.sigle_e || '') + r.nom_e);
    this.fermerDetail();
    this.router.navigate(['info/ecole', slug, r.id_ecol]);
  }

  private genererSlug(name: string): string {
    return name.toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // ── Utilitaires ───────────────────────────────────────────────────────

  iconePourBranche(branche: string): string {
    return ICONES_BRANCHE[branche] ?? 'bi-mortarboard';
  }

  iconePourParent(nomParent: string): string {
    return ICONES_PARENT[nomParent] ?? 'bi-grid';
  }

  formaterCout(cout: string): string {
    if (!cout) return 'Non précisé';
    const n = parseFloat(cout.replace(/\s/g, '').replace(',', '.'));
    if (isNaN(n)) return cout;
    return new Intl.NumberFormat('fr-FR').format(n) + ' FCFA';
  }
}
