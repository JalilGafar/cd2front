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
import jsPDF, { GState } from 'jspdf';

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

// Messages d'encouragement affichés toutes les 12 questions (1 tiré au sort,
// sans répétition, à chaque palier — voir piocherMessagePause()), pour casser
// la monotonie d'un questionnaire de 60 affirmations. Mélange volontairement
// large de tons et de sujets (encouragements, anecdotes métiers, citations,
// évolution du monde du travail, données, histoire, IA...) pour que chaque
// passage du test semble unique.
const MESSAGES_ENCOURAGEMENT: string[] = [
  // ── Encouragements généraux ────────────────────────────────────────
  "Connaître sa personnalité aide à faire des choix d'orientation qui te correspondent vraiment.",
  "Il n'y a pas de bonne ou de mauvaise réponse : seulement la tienne.",
  'Le modèle RIASEC est utilisé depuis plus de 60 ans pour aider des millions de personnes à trouver leur voie.',
  'Chaque réponse rapproche un peu plus de la découverte de ton profil.',
  'Se connaître soi-même est la première étape vers une carrière épanouissante.',
  'Prends ton temps : ton profil se dessine déjà !',
  "Un bon choix d'orientation commence toujours par une bonne connaissance de soi.",
  'Continue comme ça, tu es sur la bonne voie pour découvrir tes forces.',

  // ── Anecdotes sur des métiers ───────────────────────────────────────
  "Le titre d'ingénieur au sens moderne remonte au 18e siècle, avec l'émergence des grandes écoles techniques.",
  "Le métier d'avocat commence rarement à l'audience : la majeure partie du travail se fait en amont, dans la recherche et la stratégie.",
  "Les géologues ont permis de dater l'âge de la Terre à environ 4,5 milliards d'années.",
  'Un professeur touche en moyenne plusieurs milliers de vies au fil de sa carrière.',
  "Le métier de développeur informatique existait à peine il y a 50 ans — c'est aujourd'hui l'un des plus recherchés au monde.",
  "L'architecture est l'un des rares métiers qui demande à la fois la sensibilité d'un artiste et la rigueur d'un ingénieur.",
  'Les métiers de la santé recrutent massivement au Cameroun et dans toute l\'Afrique : la demande dépasse largement l\'offre de formation.',
  "La comptabilité est l'un des plus vieux métiers organisés : les premières traces datent de plus de 5000 ans, en Mésopotamie.",
  "Un pilote de ligne passe en moyenne plus de temps à se former et à s'entraîner qu'à effectivement piloter.",
  "Le métier d'infirmier combine des compétences techniques pointues et une capacité d'écoute rarement égalée ailleurs.",

  // ── Citations ────────────────────────────────────────────────────────
  "« Choisis un travail que tu aimes et tu n'auras pas à travailler un seul jour de ta vie. » — Confucius",
  '« Le succès, c\'est tomber sept fois et se relever huit. » — Proverbe japonais',
  "« L'éducation est l'arme la plus puissante pour changer le monde. » — Nelson Mandela",
  "« Le seul endroit où le succès précède le travail, c'est dans le dictionnaire. » — Vidal Sassoon",
  '« Ce que nous devenons dépend de ce que nous lisons après que tous les professeurs ont fini avec nous. » — T. C. Mendenhall',
  '« On ne va nulle part si l\'on ne croit pas d\'abord que l\'on peut y arriver. » — Proverbe africain',

  // ── L'évolution du monde du travail ─────────────────────────────────
  "Le télétravail, marginal avant 2020, est devenu une norme pour des millions de salariés en quelques années.",
  "Un jeune qui entre aujourd'hui sur le marché du travail changera probablement plusieurs fois de métier au cours de sa carrière.",
  "La « carrière pour la vie » dans une seule entreprise, dominante au 20e siècle, cède la place à des parcours plus flexibles.",
  "De plus en plus d'entreprises recrutent autant sur les compétences humaines (« soft skills ») que sur les diplômes.",
  'Le travail indépendant connaît une croissance forte, porté par les plateformes numériques et le désir d\'autonomie.',

  // ── Données démographiques sur le travail ──────────────────────────
  "En Afrique subsaharienne, plus de la moitié des emplois relèvent encore du secteur informel — un vrai défi pour la formation professionnelle.",
  'Le secteur des services emploie aujourd\'hui la majorité de la population active dans la plupart des économies du monde.',
  'La jeunesse africaine est la plus nombreuse au monde : une large majorité de la population du continent a moins de 25 ans.',
  "L'agriculture reste le premier employeur dans de nombreux pays africains, malgré la croissance rapide des services et du numérique.",

  // ── Révolution industrielle & salariat ──────────────────────────────
  "La révolution industrielle du 18e siècle a transformé le travail artisanal en travail salarié dans de grandes usines.",
  "Le salariat, aujourd'hui la norme, n'est devenu majoritaire qu'au cours du 20e siècle dans la plupart des pays industrialisés.",
  "La machine à vapeur, puis l'électricité, ont chacune déclenché une vague de transformation des métiers — un peu comme le numérique aujourd'hui.",
  "La journée de travail limitée, évidente pour beaucoup aujourd'hui, a été une conquête sociale obtenue de haute lutte.",

  // ── Entrepreneuriat ──────────────────────────────────────────────────
  'Beaucoup de grandes entreprises mondiales ont démarré dans un garage ou une chambre d\'étudiant.',
  "L'entrepreneuriat est en plein essor en Afrique, porté par une jeunesse connectée et créative.",
  'Créer son entreprise, c\'est accepter l\'incertitude — mais aussi la liberté de construire un projet à son image.',
  "L'économie sociale et solidaire propose une autre vision de l'entrepreneuriat, centrée sur l'impact plutôt que le seul profit.",

  // ── Syndicalisme ─────────────────────────────────────────────────────
  "Le syndicalisme est né au 19e siècle pour défendre les droits des travailleurs face aux excès de la révolution industrielle.",
  "Les congés payés et la sécurité sociale, souvent tenus pour acquis, sont le fruit de luttes syndicales historiques.",

  // ── Impact du numérique ──────────────────────────────────────────────
  "Le numérique a créé des milliers de métiers qui n'existaient pas il y a 20 ans : community manager, data scientist, développeur mobile...",
  "L'automatisation transforme certains métiers plus qu'elle ne les supprime — elle déplace surtout les tâches vers plus de créativité et de relationnel.",
  'Une grande partie des offres d\'emploi exigent aujourd\'hui des compétences numériques de base, quel que soit le secteur.',

  // ── Entreprises qui ont révolutionné leur secteur ───────────────────
  "Le fabricant de meubles Ikea a révolutionné son secteur avec le meuble en kit, transportable et à monter soi-même.",
  "Uber a bouleversé le secteur du transport en connectant directement chauffeurs et passagers via une application.",
  "Amazon a commencé comme une simple librairie en ligne avant de redéfinir la distribution mondiale.",
  "La banque mobile a permis à des millions d'Africains sans compte bancaire classique d'accéder pour la première fois à des services financiers.",

  // ── Pionniers de certains domaines ───────────────────────────────────
  "Ada Lovelace est considérée comme la première programmeuse de l'histoire — bien avant l'invention de l'ordinateur moderne.",
  'Marie Curie reste la seule personne à avoir reçu deux prix Nobel dans deux disciplines scientifiques différentes.',
  "Wangari Maathai, première femme africaine lauréate du prix Nobel de la paix, a fondé un mouvement qui a planté des millions d'arbres.",
  "Les frères Wright, sans formation d'ingénieur reconnue, ont réalisé le premier vol motorisé de l'histoire en 1903.",

  // ── Intelligence artificielle ────────────────────────────────────────
  "L'intelligence artificielle transforme des métiers entiers — du diagnostic médical à la création artistique — sans forcément les faire disparaître.",
  'Savoir travailler avec l\'IA devient une compétence recherchée dans presque tous les secteurs, de la santé à l\'agriculture.',
  "Les experts s'accordent sur un point : ceux qui sauront utiliser l'IA auront un avantage sur ceux qui l'ignoreront.",
];

// Couleurs RGB par dimension, alignées sur les badges .riasec-badge-* du
// SCSS — réutilisées dans le PDF (barres de score) pour rester cohérent
// avec l'identité visuelle déjà utilisée à l'écran.
const COULEURS_DIMENSION: Record<Dimension, [number, number, number]> = {
  R: [220, 53, 69],
  I: [139, 92, 246],
  A: [255, 193, 7],
  S: [0, 123, 255],
  E: [40, 167, 69],
  C: [249, 115, 22],
};

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
  // Pioche mélangée, consommée à chaque pause : garantit qu'aucun message ne
  // se répète au sein d'un même passage de 60 questions (voir demarrerTest()
  // et declencherPause()).
  private pileMessagesPause: string[] = [];

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
    this.pileMessagesPause = this.melangerMessages();
    this.scrollHaut();
    this.cdr.markForCheck();
  }

  private melangerMessages(): string[] {
    const copie = [...MESSAGES_ENCOURAGEMENT];
    for (let i = copie.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copie[i], copie[j]] = [copie[j], copie[i]];
    }
    return copie;
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
    // Filet de sécurité : avec 4 paliers par passage et un pool de 50+
    // messages, la pioche ne devrait jamais s'épuiser — mais si elle l'était,
    // on la remélange plutôt que de planter.
    if (this.pileMessagesPause.length === 0) {
      this.pileMessagesPause = this.melangerMessages();
    }
    this.messagePause = this.pileMessagesPause.pop()!;
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
    this.pileMessagesPause = [];
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
  // Tient volontairement sur une seule page : chaque section démarre à une
  // position verticale fixe (plutôt que cumulée) pour ne jamais déborder sur
  // une 2e page, quitte à laisser un peu de blanc si le contenu est court.
  telechargerPdf(): void {
    if (typeof window === 'undefined') return;

    const doc = new jsPDF();
    const margeGauche = 18;
    const largeurUtile = 174;

    // ── Filigrane (dessiné en premier, sous le reste du contenu) ──────
    doc.setGState(new GState({ opacity: 0.06 }));
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(64);
    doc.setTextColor(124, 58, 237);
    doc.text('Camerdiplome.com', 105, 165, { angle: 45, align: 'center' });
    doc.setGState(new GState({ opacity: 1 }));

    // ── En-tête ────────────────────────────────────────────────────────
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('Camerdiplome — Mon profil RIASEC', margeGauche, 20);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const nomComplet = [this.leadPrenom, this.leadNom].filter(Boolean).join(' ').trim();
    const ligneIdentite = nomComplet
      ? `${nomComplet} — ${new Date().toLocaleDateString('fr-FR')}`
      : new Date().toLocaleDateString('fr-FR');
    doc.text(ligneIdentite, margeGauche, 26);

    doc.setDrawColor(124, 58, 237);
    doc.setLineWidth(0.5);
    doc.line(margeGauche, 29, margeGauche + largeurUtile, 29);

    // ── Introduction : qu'est-ce que le RIASEC, comment le lire ───────
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const intro = doc.splitTextToSize(
      "Le test RIASEC (ou test de Holland) identifie vos affinités professionnelles selon 6 " +
      "dimensions : Réaliste, Investigateur, Artistique, Social, Entreprenant et Conventionnel. " +
      "Votre code à 3 lettres résume vos types dominants — plus le score est élevé, plus la " +
      "dimension vous correspond. Utilisez ce rapport pour explorer les métiers et formations " +
      "en lien avec votre profil, seul(e) ou avec un conseiller.",
      largeurUtile
    );
    doc.text(intro, margeGauche, 37);

    // ── Radar (moitié gauche) + détail des scores (moitié droite) ─────
    const sectionRadarY = 66;
    const largeurRadar  = 82;
    const image = this.chartRef?.getBase64Image();
    if (image) {
      doc.addImage(image, 'PNG', margeGauche, sectionRadarY, largeurRadar, largeurRadar);
    }

    const xScores = margeGauche + largeurRadar + 8;
    const largeurScores = margeGauche + largeurUtile - xScores;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Détail par dimension', xScores, sectionRadarY + 2);

    ORDRE_DIMENSIONS.forEach((d, i) => {
      const rowY = sectionRadarY + 10 + i * 11.5;
      const [r, g, b] = COULEURS_DIMENSION[d];
      const score = this.scores[d];
      const pct = scorePourcentage(score);

      doc.setFillColor(r, g, b);
      doc.rect(xScores, rowY - 3.2, 4, 4, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(31, 41, 55);
      doc.text(this.dimensionsInfo[d].nom, xScores + 6, rowY);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(`${score}/50`, xScores + largeurScores, rowY, { align: 'right' });

      doc.setFillColor(229, 231, 235);
      doc.rect(xScores, rowY + 2, largeurScores, 2.2, 'F');
      doc.setFillColor(r, g, b);
      doc.rect(xScores, rowY + 2, (largeurScores * pct) / 100, 2.2, 'F');
    });

    // ── Votre profil ───────────────────────────────────────────────────
    const profileY = 158;
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(109, 40, 217);
    doc.text(
      `Votre profil : ${this.dimensionsInfo[this.typeDominant].nom} (${this.codeRiasec})`,
      margeGauche, profileY
    );

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const descriptionProfil = doc.splitTextToSize(
      this.dimensionsInfo[this.typeDominant].descriptionLongue, largeurUtile
    );
    doc.text(descriptionProfil, margeGauche, profileY + 7);

    // ── Métiers suggérés (tableau, 4 par ligne) ────────────────────────
    const metiersY = 195;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Métiers qui pourraient vous correspondre', margeGauche, metiersY);

    if (this.metiersSuggeres.length > 0) {
      const colonnes      = 4;
      const espace        = 5;
      const largeurCellule = (largeurUtile - (colonnes - 1) * espace) / colonnes;
      const hauteurCellule = 18;

      this.metiersSuggeres.forEach((m, i) => {
        const col = i % colonnes;
        const ligne = Math.floor(i / colonnes);
        const x = margeGauche + col * (largeurCellule + espace);
        const y = metiersY + 6 + ligne * (hauteurCellule + espace);

        doc.setDrawColor(229, 231, 235);
        doc.setFillColor(249, 250, 251);
        doc.roundedRect(x, y, largeurCellule, hauteurCellule, 2, 2, 'FD');

        doc.setFontSize(8.5);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(31, 41, 55);
        const texteMetier = doc.splitTextToSize(m.titre, largeurCellule - 6);
        doc.text(texteMetier, x + largeurCellule / 2, y + hauteurCellule / 2, {
          align: 'center', baseline: 'middle',
        });
      });
    } else {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('Aucune suggestion de métier disponible pour votre profil pour le moment.', margeGauche, metiersY + 8);
    }

    // ── Pied de page : lien cliquable ──────────────────────────────────
    doc.setFontSize(9);
    doc.setTextColor(109, 40, 217);
    doc.textWithLink('Généré via Camerdiplome.com — Test RIASEC', margeGauche, 285, {
      url: 'https://www.camerdiplome.com',
    });

    doc.save('mon-profil-riasec.pdf');
  }
}
