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
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

import { environment } from '../../../../environments/environment';
import { telephoneInvalide as estTelephoneInvalide, TelephoneIntl } from '../../../shared/utils/phone-validation.util';
import { OptionSelect, STATUTS_OPTIONS, ANNEES_OPTIONS } from '../../../shared/utils/lead-options';
import {
  DIMENSIONS_INFO,
  Dimension,
  ORDRE_DIMENSIONS,
  RIASEC_QUESTIONS,
  ScoresRiasec,
  calculerScores,
  determinerCodeHolland,
  scorePourcentage,
} from './riasec-data';

type Phase = 'intro' | 'quiz' | 'resultat';

interface MetierSuggere {
  id_metier: number;
  titre: string;
  pertinence: number;
}

const SCORES_VIDES: ScoresRiasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ChartModule,
    DropdownModule,
    ProgressSpinnerModule,
    NgxIntlTelInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  private readonly cdr     = inject(ChangeDetectorRef);
  private readonly http    = inject(HttpClient);
  private readonly apiBase = environment.apiUrl;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Phases ──────────────────────────────────────────────────────────
  phase: Phase = 'intro';

  // ── Quiz ────────────────────────────────────────────────────────────
  readonly questions = RIASEC_QUESTIONS;
  readonly totalQuestions = RIASEC_QUESTIONS.length;
  readonly echelle = [1, 2, 3, 4, 5];
  readonly libellesEchelle: Record<number, string> = {
    1: "Pas du tout d'accord",
    2: "Plutôt pas d'accord",
    3: 'Neutre',
    4: "Plutôt d'accord",
    5: "Tout à fait d'accord",
  };

  questionActuelle = 0;
  reponses: Record<number, number> = {};

  get question() {
    return this.questions[this.questionActuelle];
  }

  get progression(): number {
    return Math.round((this.questionActuelle / this.totalQuestions) * 100);
  }

  get peutReculer(): boolean {
    return this.questionActuelle > 0;
  }

  demarrerTest(): void {
    this.phase = 'quiz';
    this.questionActuelle = 0;
    this.reponses = {};
    this.scrollHaut();
    this.cdr.markForCheck();
  }

  repondre(valeur: number): void {
    this.reponses[this.question.id] = valeur;
    if (this.questionActuelle < this.totalQuestions - 1) {
      this.questionActuelle++;
      this.scrollHaut();
    } else {
      this.terminerQuiz();
    }
    this.cdr.markForCheck();
  }

  questionPrecedente(): void {
    if (this.peutReculer) {
      this.questionActuelle--;
      this.scrollHaut();
      this.cdr.markForCheck();
    }
  }

  private terminerQuiz(): void {
    this.scores = calculerScores(this.reponses);
    this.codeRiasec = determinerCodeHolland(this.scores);
    // Calculé une seule fois ici (et non via un getter) : radarData est lié à
    // [data] sur <p-chart>, or le formulaire de capture lead ajouté dans cette
    // même phase résultat (ngModel) déclenche une passe de change detection à
    // chaque frappe. Un getter renverrait un nouvel objet à chaque passe et
    // ferait détruire/reconstruire le graphique à chaque touche pressée dans
    // le formulaire (bug déjà corrigé côté Task 5, à ne pas réintroduire ici).
    this.radarData = {
      labels: ORDRE_DIMENSIONS.map(d => DIMENSIONS_INFO[d].nom),
      datasets: [
        {
          label: 'Votre profil',
          data: ORDRE_DIMENSIONS.map(d => scorePourcentage(this.scores[d])),
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: '#7c3aed',
          pointBackgroundColor: '#7c3aed',
        },
      ],
    };
    this.phase = 'resultat';
    this.scrollHaut();
  }

  private scrollHaut(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ── Résultat ────────────────────────────────────────────────────────
  scores: ScoresRiasec = SCORES_VIDES;
  codeRiasec = '';

  get dimensionsInfo() {
    return DIMENSIONS_INFO;
  }

  get typeDominant(): Dimension {
    return (this.codeRiasec[0] as Dimension) ?? 'R';
  }

  get codeRiasecLettres(): Dimension[] {
    return this.codeRiasec.split('') as Dimension[];
  }

  get typesSecondaires(): Dimension[] {
    return this.codeRiasecLettres.slice(1);
  }

  radarData: any = null;

  readonly radarOptions = {
    plugins: { legend: { display: false } },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: { display: false },
      },
    },
  };

  refaireLeTest(): void {
    this.phase = 'intro';
    this.questionActuelle = 0;
    this.reponses = {};
    this.scores = SCORES_VIDES;
    this.codeRiasec = '';
    this.radarData = null;
    this.leadSoumis = false;
    this.leadErreur = false;
    this.leadNom = '';
    this.leadPrenom = '';
    this.leadTelObj = null;
    this.leadEmail = '';
    this.leadStatut = null;
    this.leadAnnee = null;
    this.metiersSuggeres = [];
    this.scrollHaut();
    this.cdr.markForCheck();
  }

  // ── Capture lead ────────────────────────────────────────────────────
  readonly statutsOptions = STATUTS_OPTIONS;
  readonly anneesOptions  = ANNEES_OPTIONS;

  leadNom         = '';
  leadPrenom      = '';
  leadTelObj: any = null;
  leadEmail       = '';
  leadStatut: OptionSelect | null = null;
  leadAnnee: OptionSelect | null  = null;
  leadSoumis      = false;
  leadChargement  = false;
  leadErreur      = false;
  metiersSuggeres: MetierSuggere[] = [];

  telephoneInvalide(): boolean {
    return estTelephoneInvalide(this.leadTelObj as TelephoneIntl | null);
  }

  soumettreLead(): void {
    if (!this.leadNom.trim() || !this.leadPrenom.trim() || !this.leadTelObj || this.telephoneInvalide()) return;
    this.leadChargement = true;
    this.leadErreur     = false;

    const payload = {
      name:     this.leadNom.trim(),
      surname:  this.leadPrenom.trim(),
      tel:      this.leadTelObj?.e164Number ?? this.leadTelObj?.internationalNumber ?? '',
      email:    this.leadEmail.trim(),
      statuts:  this.leadStatut?.value ?? '',
      bornDate: this.leadAnnee?.value ?? '',
      scores: {
        r: this.scores.R, i: this.scores.I, a: this.scores.A,
        s: this.scores.S, e: this.scores.E, c: this.scores.C,
      },
    };

    this.http.post<{ success: boolean; metiers: MetierSuggere[] }>(
      `${this.apiBase}/api/riasec/submit`, payload
    ).subscribe({
      next: (reponse) => {
        if (!reponse.success) {
          this.debloquerApresLead(true);
          return;
        }
        this.metiersSuggeres = reponse.metiers ?? [];
        this.debloquerApresLead(false);
      },
      error: () => this.debloquerApresLead(true),
    });
  }

  private debloquerApresLead(echec: boolean): void {
    this.leadSoumis     = true;
    this.leadErreur     = echec;
    this.leadChargement = false;
    this.scrollHaut();
    this.cdr.markForCheck();
  }

  // ── CTA WhatsApp (rapport débloqué) ────────────────────────────────────
  // Même pattern que OrientationV2Component.contacterConseiller() : lien
  // WhatsApp pré-rempli, même numéro, garde SSR identique.
  contacterConseillerRiasec(): void {
    if (typeof window === 'undefined') return;
    const msg = encodeURIComponent(
      `Bonjour, j'ai fait le test RIASEC et mon profil est "${this.dimensionsInfo[this.typeDominant].nom}" ` +
      `(code ${this.codeRiasec}). Je souhaite être accompagné(e) par un conseiller pour trouver ma formation.`
    );
    window.open(`https://wa.me/237676476096?text=${msg}`, '_blank', 'noopener,noreferrer');
  }
}
