export type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  dimension: Dimension;
  texte: string;
}

export interface DimensionInfo {
  code: Dimension;
  nom: string;
  description: string;
  descriptionLongue: string;
}

export interface ScoresRiasec {
  R: number;
  I: number;
  A: number;
  S: number;
  E: number;
  C: number;
}

export const ORDRE_DIMENSIONS: Dimension[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const RIASEC_QUESTIONS: Question[] = [
  // R — Réaliste
  { id: 1,  dimension: 'R', texte: "J'aime réparer ou construire des objets de mes mains." },
  { id: 2,  dimension: 'R', texte: "Je préfère les activités physiques aux tâches de bureau." },
  { id: 3,  dimension: 'R', texte: "Travailler avec des outils ou des machines m'intéresse." },
  { id: 4,  dimension: 'R', texte: "Je suis attiré(e) par les métiers en plein air (agriculture, BTP, mécanique)." },
  { id: 5,  dimension: 'R', texte: "Je comprends facilement le fonctionnement d'un appareil ou d'un moteur." },
  { id: 6,  dimension: 'R', texte: "Je préfère un résultat concret et visible à la fin d'une tâche." },
  { id: 7,  dimension: 'R', texte: "Bricoler, démonter, assembler : j'adore ça." },
  { id: 8,  dimension: 'R', texte: "Je suis plus à l'aise sur le terrain que derrière un bureau." },
  { id: 9,  dimension: 'R', texte: "Les métiers techniques (électricité, automobile, BTP) m'attirent." },
  { id: 10, dimension: 'R', texte: "Je préfère agir directement plutôt que théoriser longtemps." },
  // I — Investigateur
  { id: 11, dimension: 'I', texte: "J'aime comprendre pourquoi les choses fonctionnent comme elles fonctionnent." },
  { id: 12, dimension: 'I', texte: "Résoudre un problème complexe me procure de la satisfaction." },
  { id: 13, dimension: 'I', texte: "Je pose souvent beaucoup de questions pour comprendre un sujet en profondeur." },
  { id: 14, dimension: 'I', texte: "Les sciences (maths, physique, biologie...) m'intéressent particulièrement." },
  { id: 15, dimension: 'I', texte: "J'aime analyser des données ou des informations avant de conclure." },
  { id: 16, dimension: 'I', texte: "Je préfère chercher moi-même une réponse plutôt qu'on me la donne." },
  { id: 17, dimension: 'I', texte: "Les enquêtes, expériences ou recherches m'attirent." },
  { id: 18, dimension: 'I', texte: "Je réfléchis avant d'agir, j'aime comprendre avant de faire." },
  { id: 19, dimension: 'I', texte: "Travailler seul(e) sur un problème intellectuel ne me dérange pas." },
  { id: 20, dimension: 'I', texte: "Je suis curieux(se) du fonctionnement du monde qui m'entoure." },
  // A — Artistique
  { id: 21, dimension: 'A', texte: "J'aime m'exprimer à travers l'art (dessin, musique, écriture, danse...)." },
  { id: 22, dimension: 'A', texte: "J'ai besoin de liberté pour être créatif(ve)." },
  { id: 23, dimension: 'A', texte: "Je remarque facilement ce qui est beau ou original autour de moi." },
  { id: 24, dimension: 'A', texte: "Imaginer, inventer, créer quelque chose de nouveau me plaît." },
  { id: 25, dimension: 'A', texte: "Je préfère les activités où il n'y a pas qu'une seule bonne réponse." },
  { id: 26, dimension: 'A', texte: "J'aime sortir des sentiers battus plutôt que suivre des règles strictes." },
  { id: 27, dimension: 'A', texte: "La mode, le design ou la décoration m'intéressent." },
  { id: 28, dimension: 'A', texte: "Je m'ennuie vite dans les tâches répétitives et sans imagination." },
  { id: 29, dimension: 'A', texte: "Écrire, composer ou créer une œuvre me donne de l'énergie." },
  { id: 30, dimension: 'A', texte: "Je me sens à l'aise pour improviser ou exprimer mes émotions." },
  // S — Social
  { id: 31, dimension: 'S', texte: "J'aime aider les autres à résoudre leurs problèmes." },
  { id: 32, dimension: 'S', texte: "Écouter et conseiller quelqu'un me vient naturellement." },
  { id: 33, dimension: 'S', texte: "Travailler en contact direct avec les gens m'énergise." },
  { id: 34, dimension: 'S', texte: "Enseigner ou expliquer quelque chose à quelqu'un me plaît." },
  { id: 35, dimension: 'S', texte: "Je me soucie du bien-être des personnes autour de moi." },
  { id: 36, dimension: 'S', texte: "Je préfère le travail en équipe au travail en solitaire." },
  { id: 37, dimension: 'S', texte: "Les métiers de la santé, de l'éducation ou du social m'attirent." },
  { id: 38, dimension: 'S', texte: "On me confie souvent des rôles où je dois soutenir les autres." },
  { id: 39, dimension: 'S', texte: "Comprendre les émotions des autres me semble facile." },
  { id: 40, dimension: 'S', texte: "Je me sens utile quand j'accompagne quelqu'un vers la réussite." },
  // E — Entreprenant
  { id: 41, dimension: 'E', texte: "J'aime convaincre les autres et défendre mes idées." },
  { id: 42, dimension: 'E', texte: "Prendre des initiatives et diriger un projet me motive." },
  { id: 43, dimension: 'E', texte: "L'idée de créer ou diriger ma propre entreprise m'attire." },
  { id: 44, dimension: 'E', texte: "Je me vois bien négocier ou vendre un produit/service." },
  { id: 45, dimension: 'E', texte: "J'aime relever des défis ambitieux et prendre des risques calculés." },
  { id: 46, dimension: 'E', texte: "Être responsable d'une équipe ne me fait pas peur." },
  { id: 47, dimension: 'E', texte: "Je suis motivé(e) par la réussite, la reconnaissance et l'argent." },
  { id: 48, dimension: 'E', texte: "Je prends facilement la parole en public pour défendre un projet." },
  { id: 49, dimension: 'E', texte: "Je préfère organiser et décider plutôt qu'exécuter les décisions des autres." },
  { id: 50, dimension: 'E', texte: "Le monde des affaires et du commerce m'intéresse." },
  // C — Conventionnel
  { id: 51, dimension: 'C', texte: "J'aime organiser, classer et structurer les informations." },
  { id: 52, dimension: 'C', texte: "Suivre des règles et des procédures claires me rassure." },
  { id: 53, dimension: 'C', texte: "Je suis attentif(ve) aux détails et je n'aime pas l'approximation." },
  { id: 54, dimension: 'C', texte: "Travailler avec des chiffres, des tableaux ou des bases de données me plaît." },
  { id: 55, dimension: 'C', texte: "Je préfère un cadre de travail stable et prévisible." },
  { id: 56, dimension: 'C', texte: "La gestion, la comptabilité ou l'administration m'intéressent." },
  { id: 57, dimension: 'C', texte: "Je termine toujours ce que je commence, de façon méthodique." },
  { id: 58, dimension: 'C', texte: "Respecter les délais et les consignes est important pour moi." },
  { id: 59, dimension: 'C', texte: "Je suis plutôt discipliné(e) et organisé(e) dans mon travail." },
  { id: 60, dimension: 'C', texte: "Je me sens à l'aise avec les outils bureautiques (Excel, bases de données...)." },
];

export const DIMENSIONS_INFO: Record<Dimension, DimensionInfo> = {
  R: {
    code: 'R', nom: 'Réaliste',
    description: 'Concret, manuel et orienté terrain.',
    descriptionLongue: "Vous aimez les activités concrètes, manuelles ou techniques : construire, réparer, manipuler des outils ou des machines. Vous préférez agir et obtenir un résultat visible plutôt que théoriser. Les environnements de plein air ou d'atelier vous conviennent bien.",
  },
  I: {
    code: 'I', nom: 'Investigateur',
    description: 'Analytique, curieux et scientifique.',
    descriptionLongue: "Vous aimez comprendre, analyser et résoudre des problèmes complexes. La recherche, l'observation et la réflexion vous attirent plus que l'action immédiate. Les sciences et les activités qui demandent de la rigueur intellectuelle vous conviennent bien.",
  },
  A: {
    code: 'A', nom: 'Artistique',
    description: 'Créatif, expressif et original.',
    descriptionLongue: "Vous avez besoin de liberté et d'expression personnelle. La création, l'originalité et l'esthétique comptent beaucoup pour vous. Vous vous épanouissez dans des environnements peu structurés qui laissent place à l'imagination.",
  },
  S: {
    code: 'S', nom: 'Social',
    description: "Attentif aux autres et à l'écoute.",
    descriptionLongue: "Vous aimez aider, écouter, enseigner ou accompagner les autres. Le contact humain vous motive plus que le travail solitaire. Les métiers de la santé, de l'éducation ou de l'accompagnement social vous conviennent bien.",
  },
  E: {
    code: 'E', nom: 'Entreprenant',
    description: 'Persuasif, ambitieux et meneur.',
    descriptionLongue: "Vous aimez convaincre, diriger et prendre des initiatives. La compétition, le leadership et la réussite matérielle vous motivent. Les métiers du commerce, du management ou de l'entrepreneuriat vous conviennent bien.",
  },
  C: {
    code: 'C', nom: 'Conventionnel',
    description: 'Organisé, méthodique et rigoureux.',
    descriptionLongue: "Vous aimez structurer, organiser et suivre des procédures claires. La précision, la fiabilité et un cadre de travail stable vous conviennent. Les métiers de la gestion, de la comptabilité ou de l'administration vous conviennent bien.",
  },
};

export function calculerScores(reponses: Record<number, number>): ScoresRiasec {
  const scores: ScoresRiasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
  for (const question of RIASEC_QUESTIONS) {
    const valeur = reponses[question.id];
    if (typeof valeur === 'number') {
      scores[question.dimension] += valeur;
    }
  }
  return scores;
}

export function determinerCodeHolland(scores: ScoresRiasec): string {
  return [...ORDRE_DIMENSIONS]
    .sort((a, b) => {
      const diff = scores[b] - scores[a];
      return diff !== 0 ? diff : ORDRE_DIMENSIONS.indexOf(a) - ORDRE_DIMENSIONS.indexOf(b);
    })
    .slice(0, 3)
    .join('');
}

// score brut par dimension : 10 (10 questions x 1) à 50 (10 questions x 5)
export function scorePourcentage(score: number): number {
  return Math.round((score / 50) * 100);
}
