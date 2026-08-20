import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { ChartModule, UIChart } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import jsPDF from 'jspdf';

import { environment } from '../../../../environments/environment';
import {
  telephoneIncomplet as estTelephoneIncomplet,
  telephoneInvalide as estTelephoneInvalide,
  TelephoneIntl,
} from '../../../shared/utils/phone-validation.util';
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

// Messages d'encouragement affichés toutes les 12 questions (1 tiré au sort
// à chaque palier), pour casser la monotonie d'un questionnaire de 60
// affirmations. Mélange de faits sur le test et d'encouragements génériques.
const MESSAGES_ENCOURAGEMENT: string[] = [
  "Connaître sa personnalité aide à faire des choix d'orientation qui te correspondent vraiment.",
  "Il n'y a pas de bonne ou de mauvaise réponse : seulement la tienne.",
  'Le modèle RIASEC est utilisé depuis plus de 60 ans pour aider des millions de personnes à trouver leur voie.',
  'Chaque réponse rapproche un peu plus de la découverte de ton profil.',
  'Se connaître soi-même est la première étape vers une carrière épanouissante.',
  'Prends ton temps : ton profil se dessine déjà !',
  "Un bon choix d'orientation commence toujours par une bonne connaissance de soi.",
  'Continue comme ça, tu es sur la bonne voie pour découvrir tes forces.',
];

// Animation d'entrée pour le contenu du quiz : rejoue à chaque changement de
// clé liée (nouvelle question ou bascule vers/depuis un écran de pause),
// même si les éléments DOM sont réutilisés — voir cleAnimationQuiz.
const questionAnim = trigger('questionAnim', [
  transition('* => *', [
    style({ opacity: 0, transform: 'translateY(12px)' }),
    animate('220ms cubic-bezier(0.4, 0, 0.2, 1)', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
]);

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
  animations: [questionAnim],
})
export class TestComponent implements OnInit {
  private readonly cdr     = inject(ChangeDetectorRef);
  private readonly http    = inject(HttpClient);
  private readonly apiBase = environment.apiUrl;

  // Référence au composant p-chart affiché en phase résultat, utilisée pour
  // exporter le radar en image (voir telechargerPdf()). Optionnelle : le
  // graphique n'existe dans le DOM que quand phase === 'resultat'.
  @ViewChild(UIChart) chartRef?: UIChart;

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

  // ── Pause d'encouragement (toutes les 12 questions) ────────────────────
  pauseActive = false;
  messagePause = '';
  private readonly PALIER_PAUSE = 12;

  get question() {
    return this.questions[this.questionActuelle];
  }

  get progression(): number {
    return Math.round((this.questionActuelle / this.totalQuestions) * 100);
  }

  get peutReculer(): boolean {
    return this.questionActuelle > 0 && !this.pauseActive;
  }

  // Clé liée à l'animation d'entrée (@questionAnim) : change à chaque
  // nouvelle question ET à chaque bascule pause/quiz, pour que la
  // transition rejoue systématiquement même si les nœuds DOM sont réutilisés.
  get cleAnimationQuiz(): string {
    return this.pauseActive ? `pause-${this.questionActuelle}` : `q-${this.questionActuelle}`;
  }

  demarrerTest(): void {
    this.phase = 'quiz';
    this.questionActuelle = 0;
    this.reponses = {};
    this.pauseActive = false;
    this.scrollHaut();
    this.cdr.markForCheck();
  }

  repondre(valeur: number, event?: Event): void {
    // Rend le focus au bouton avant de changer de question : sans ça, le
    // focus visuel du navigateur reste sur le bouton (même nœud DOM réutilisé
    // par *ngFor pour la question suivante) et donne l'impression que la
    // réponse précédente est toujours sélectionnée.
    (event?.currentTarget as HTMLElement | undefined)?.blur();

    this.reponses[this.question.id] = valeur;
    if (this.questionActuelle < this.totalQuestions - 1) {
      this.questionActuelle++;
      if (this.questionActuelle % this.PALIER_PAUSE === 0) {
        this.declencherPause();
      } else {
        this.scrollHaut();
      }
    } else {
      this.terminerQuiz();
    }
    this.cdr.markForCheck();
  }

  private declencherPause(): void {
    this.messagePause = MESSAGES_ENCOURAGEMENT[
      Math.floor(Math.random() * MESSAGES_ENCOURAGEMENT.length)
    ];
    this.pauseActive = true;
    this.scrollHaut();
  }

  continuerApresPause(): void {
    this.pauseActive = false;
    this.scrollHaut();
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
    this.pauseActive = false;
    this.messagePause = '';
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

  // Distinct de telephoneInvalide() : un numéro peut être "pas encore
  // invalide" (aucune raison de le rejeter) tout en étant encore incomplet
  // (l'utilisateur vient de taper le premier chiffre). Les deux gardes sont
  // nécessaires pour désactiver correctement le bouton de soumission.
  telephoneIncomplet(): boolean {
    return estTelephoneIncomplet(this.leadTelObj as TelephoneIntl | null);
  }

  soumettreLead(): void {
    if (
      !this.leadNom.trim() || !this.leadPrenom.trim() || !this.leadTelObj ||
      this.telephoneIncomplet() || this.telephoneInvalide()
    ) return;
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

  // ── Téléchargement PDF (rapport débloqué) ──────────────────────────────
  telechargerPdf(): void {
    if (typeof window === 'undefined') return;

    const doc = new jsPDF();
    const margeGauche = 20;
    const largeurUtile = 170;
    let y = 20;

    const ajouterSaut = (hauteur: number) => {
      if (y + hauteur > 280) {
        doc.addPage();
        y = 20;
      }
    };

    // En-tête
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('Camerdiplome — Mon profil RIASEC', margeGauche, y);
    y += 12;

    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(margeGauche, y, margeGauche + largeurUtile, y);
    y += 10;

    // Identité
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(31, 41, 55);
    const nomComplet = [this.leadPrenom, this.leadNom].filter(Boolean).join(' ').trim();
    if (nomComplet) {
      doc.text(`Nom : ${nomComplet}`, margeGauche, y);
      y += 7;
    }
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, margeGauche, y);
    y += 12;

    // Profil dominant
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text(`Profil dominant : ${this.dimensionsInfo[this.typeDominant].nom}`, margeGauche, y);
    y += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(`Code RIASEC : ${this.codeRiasec}`, margeGauche, y);
    y += 12;

    // Graphique radar (capturé depuis le canvas Chart.js déjà rendu)
    const image = this.chartRef?.getBase64Image();
    if (image) {
      ajouterSaut(90);
      doc.addImage(image, 'PNG', margeGauche + 25, y, 120, 80);
      y += 90;
    }

    // Description des types dominants
    ajouterSaut(10);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Votre profil en détail', margeGauche, y);
    y += 8;

    doc.setFontSize(10);
    for (const d of this.codeRiasecLettres) {
      ajouterSaut(8);
      doc.setFont('helvetica', 'bold');
      doc.text(this.dimensionsInfo[d].nom, margeGauche, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      const lignes: string[] = doc.splitTextToSize(this.dimensionsInfo[d].descriptionLongue, largeurUtile);
      ajouterSaut(lignes.length * 5 + 4);
      doc.text(lignes, margeGauche, y);
      y += lignes.length * 5 + 6;
    }

    // Métiers suggérés
    if (this.metiersSuggeres.length > 0) {
      ajouterSaut(14);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(31, 41, 55);
      doc.text('Métiers qui pourraient vous correspondre', margeGauche, y);
      y += 8;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      for (const m of this.metiersSuggeres) {
        ajouterSaut(6);
        doc.text(`• ${m.titre}`, margeGauche, y);
        y += 6;
      }
    }

    // Pied de page
    ajouterSaut(14);
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text('Généré via camerdiplome.com — Test RIASEC', margeGauche, y);

    doc.save('mon-profil-riasec.pdf');
  }
}
