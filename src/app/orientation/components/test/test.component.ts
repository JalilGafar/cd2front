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
import { RouterLink } from '@angular/router';
import { ChartModule } from 'primeng/chart';

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

const SCORES_VIDES: ScoresRiasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, RouterLink, ChartModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss',
})
export class TestComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);

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

  get radarData() {
    return {
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
  }

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
    this.scrollHaut();
    this.cdr.markForCheck();
  }
}
