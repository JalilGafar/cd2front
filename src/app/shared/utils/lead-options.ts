// Options partagées entre les deux formulaires de capture de lead
// (TestComponent — /orientation/test — et OrientationV2Component —
// /trouver-ma-formation). Auparavant dupliquées à l'identique dans les deux
// composants ; voir aussi phone-validation.util.ts pour le même type de
// mutualisation.

export interface OptionSelect {
  label: string;
  value: string;
}

export const STATUTS_OPTIONS: OptionSelect[] = [
  { label: 'Lycéen / Collégien', value: 'lycéen' },
  { label: 'Étudiant',           value: 'étudiant' },
  { label: 'En activité',        value: 'en activité' },
  { label: 'Sans emploi',        value: 'sans emploi' },
];

// L'ancien intervalle était figé en dur (1970-2009) : il excluait déjà les
// lycéens/collégiens actuels — pourtant le tout premier statut proposé
// ci-dessus. On calcule désormais l'intervalle par rapport à l'année
// courante pour qu'il reste pertinent sans jamais devenir obsolète :
// de 10 ans (âge plausible d'un lycéen/collégien) à 60 ans (actif en
// reconversion ou plus âgé) avant l'année en cours.
export function genererAnneesOptions(anneeActuelle: number = new Date().getFullYear()): OptionSelect[] {
  const anneeMax = anneeActuelle - 10;
  const anneeMin = anneeActuelle - 60;
  return Array.from({ length: anneeMax - anneeMin + 1 }, (_, i) => {
    const annee = String(anneeMax - i);
    return { label: annee, value: annee };
  });
}

export const ANNEES_OPTIONS: OptionSelect[] = genererAnneesOptions();
