# Design — Intégration du test RIASEC

Date : 2026-08-19
Composants concernés :
- Frontend : `cd2front/src/app/orientation/components/test/` (+ nouveau fichier `riasec-data.ts`, nouveau `shared/utils/phone-validation.util.ts`)
- Backend : `ec_back/routes/riasec.js` (nouveau), `ec_back/app.js` (montage de la route)
- Base de données : `ec_back/migrations/009_create_riasec.sql` (nouveau)

## Contexte

Le composant `TestComponent` (route `/orientation/test`) est déjà lié depuis la
landing page (bouton "Faire le test d'orientation", à côté de "Trouver ma
formation") mais son contenu est une page marketing statique (hero, article,
6 cartes "profils RIASEC", section "guides") : les boutons "Commencer le
test" ne déclenchent aucune logique, et plusieurs liens pointent vers des
routes qui n'existent pas dans l'application (`/guide-metiers`,
`/bilan-de-competences`, `/reconversion-professionnelle`,
`/test-orientation/profil-*`).

Objectif : transformer ce composant en un vrai test RIASEC (Holland)
fonctionnel de 60 affirmations, et relier chaque résultat à un prospect
enregistré en base — avec le même mécanisme de capture de lead ("teaser puis
verrou") que `orientation-v2` (`/trouver-ma-formation`).

## Portée

- Le composant `TestComponent` devient une state machine à 3 phases
  (`intro` → `quiz` → `resultat`), sur le modèle de `OrientationV2Component`
  (standalone, `ChangeDetectionStrategy.OnPush`, animations Angular).
- Nouvelle route backend dédiée `POST /api/riasec/submit` — je ne modifie
  **ni** `routes/resultats.js` **ni** `save_client_procedure` (procédure déjà
  fragile, corrigée deux fois — migrations 007 et 008 — sur des bugs de
  DEFINER puis de collision de nom de paramètre).
- Nouvelle table `riasec_results` + nouvelle colonne `metier.riasec_codes`
  pour relier le profil calculé à de vraies fiches métiers déjà en base (41
  lignes).
- Les 60 questions et leur contenu (libellés, descriptions par dimension)
  sont des données statiques versionnées dans le frontend — pas de table ni
  d'endpoint pour les servir, pas de back-office pour les éditer.
- Pas de stockage des 60 réponses individuelles — seuls les 6 scores agrégés
  et le code Holland à 3 lettres sont persistés.

## 1. Flux du composant

```
Phase 'intro'  (contenu existant, nettoyé — voir §6)
  │  clic "Commencer le test" (hero OU CTA bas de page)
  ▼
Phase 'quiz'
  │  60 affirmations, une à la fois, échelle 1-5
  │  (1 = Pas du tout d'accord … 5 = Tout à fait d'accord)
  │  barre de progression (x/60), bouton Précédent pour corriger
  │  60e réponse → calcul des scores CÔTÉ CLIENT (aucun appel réseau)
  ▼
Phase 'resultat' — sous-état 'teaser' (leadSoumis = false)
  │  Affiché librement : profil dominant (ex. "Investigateur"), code à 3
  │  lettres, graphique radar des 6 scores.
  │  Verrouillé : description détaillée des types dominants + liste des
  │  métiers suggérés (fiches réelles).
  │  Formulaire de capture lead (nom, prénom, téléphone requis ; statut,
  │  email, année de naissance optionnels) — mêmes composants que le
  │  formulaire lead d'orientation-v2 (ngx-intl-tel-input, p-dropdown).
  │
  │  submit → POST /api/riasec/submit
  │    succès → debloquerApresLead(false)
  │    échec réseau/serveur → debloquerApresLead(true) — on débloque quand
  │      même la vue (résultat déjà calculé localement), sans afficher un
  │      faux message de succès. Pattern identique à
  │      OrientationV2Component.soumettreLead().
  ▼
Phase 'resultat' — sous-état débloqué (leadSoumis = true)
  Vue complète : radar + description des 2-3 types dominants + grille des
  métiers suggérés (liens réels vers /info/metier/:id, renvoyés par l'API) +
  CTA "Trouver ma formation" (`/trouver-ma-formation`) et CTA WhatsApp
  (mêmes numéros/pattern que `contacterConseiller()` dans orientation-v2).
  Bouton "Refaire le test" → retour à la phase 'intro'.
```

## 2. Contenu du test — 60 affirmations

10 affirmations par dimension, échelle 1-5. Contenu original (pas repris d'un
test commercial existant), rédigé pour un public de lycéens/étudiants/jeunes
actifs camerounais, format "Je …" cohérent avec un auto-questionnaire.

Stocké dans `riasec-data.ts` :

```typescript
export type Dimension = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;          // 1..60
  dimension: Dimension;
  texte: string;
}

export const RIASEC_QUESTIONS: Question[] = [ /* 60 entrées, voir liste ci-dessous */ ];
```

**R — Réaliste** (concret, manuel, technique, terrain)
1. J'aime réparer ou construire des objets de mes mains.
2. Je préfère les activités physiques aux tâches de bureau.
3. Travailler avec des outils ou des machines m'intéresse.
4. Je suis attiré(e) par les métiers en plein air (agriculture, BTP, mécanique).
5. Je comprends facilement le fonctionnement d'un appareil ou d'un moteur.
6. Je préfère un résultat concret et visible à la fin d'une tâche.
7. Bricoler, démonter, assembler : j'adore ça.
8. Je suis plus à l'aise sur le terrain que derrière un bureau.
9. Les métiers techniques (électricité, automobile, BTP) m'attirent.
10. Je préfère agir directement plutôt que théoriser longtemps.

**I — Investigateur** (analyse, science, résolution de problèmes)
11. J'aime comprendre pourquoi les choses fonctionnent comme elles fonctionnent.
12. Résoudre un problème complexe me procure de la satisfaction.
13. Je pose souvent beaucoup de questions pour comprendre un sujet en profondeur.
14. Les sciences (maths, physique, biologie...) m'intéressent particulièrement.
15. J'aime analyser des données ou des informations avant de conclure.
16. Je préfère chercher moi-même une réponse plutôt qu'on me la donne.
17. Les enquêtes, expériences ou recherches m'attirent.
18. Je réfléchis avant d'agir, j'aime comprendre avant de faire.
19. Travailler seul(e) sur un problème intellectuel ne me dérange pas.
20. Je suis curieux(se) du fonctionnement du monde qui m'entoure.

**A — Artistique** (créativité, expression, originalité)
21. J'aime m'exprimer à travers l'art (dessin, musique, écriture, danse...).
22. J'ai besoin de liberté pour être créatif(ve).
23. Je remarque facilement ce qui est beau ou original autour de moi.
24. Imaginer, inventer, créer quelque chose de nouveau me plaît.
25. Je préfère les activités où il n'y a pas qu'une seule bonne réponse.
26. J'aime sortir des sentiers battus plutôt que suivre des règles strictes.
27. La mode, le design ou la décoration m'intéressent.
28. Je m'ennuie vite dans les tâches répétitives et sans imagination.
29. Écrire, composer ou créer une œuvre me donne de l'énergie.
30. Je me sens à l'aise pour improviser ou exprimer mes émotions.

**S — Social** (aider, enseigner, écouter, accompagner)
31. J'aime aider les autres à résoudre leurs problèmes.
32. Écouter et conseiller quelqu'un me vient naturellement.
33. Travailler en contact direct avec les gens m'énergise.
34. Enseigner ou expliquer quelque chose à quelqu'un me plaît.
35. Je me soucie du bien-être des personnes autour de moi.
36. Je préfère le travail en équipe au travail en solitaire.
37. Les métiers de la santé, de l'éducation ou du social m'attirent.
38. On me confie souvent des rôles où je dois soutenir les autres.
39. Comprendre les émotions des autres me semble facile.
40. Je me sens utile quand j'accompagne quelqu'un vers la réussite.

**E — Entreprenant** (leadership, persuasion, business)
41. J'aime convaincre les autres et défendre mes idées.
42. Prendre des initiatives et diriger un projet me motive.
43. L'idée de créer ou diriger ma propre entreprise m'attire.
44. Je me vois bien négocier ou vendre un produit/service.
45. J'aime relever des défis ambitieux et prendre des risques calculés.
46. Être responsable d'une équipe ne me fait pas peur.
47. Je suis motivé(e) par la réussite, la reconnaissance et l'argent.
48. Je prends facilement la parole en public pour défendre un projet.
49. Je préfère organiser et décider plutôt qu'exécuter les décisions des autres.
50. Le monde des affaires et du commerce m'intéresse.

**C — Conventionnel** (organisation, rigueur, méthode)
51. J'aime organiser, classer et structurer les informations.
52. Suivre des règles et des procédures claires me rassure.
53. Je suis attentif(ve) aux détails et je n'aime pas l'approximation.
54. Travailler avec des chiffres, des tableaux ou des bases de données me plaît.
55. Je préfère un cadre de travail stable et prévisible.
56. La gestion, la comptabilité ou l'administration m'intéressent.
57. Je termine toujours ce que je commence, de façon méthodique.
58. Respecter les délais et les consignes est important pour moi.
59. Je suis plutôt discipliné(e) et organisé(e) dans mon travail.
60. Je me sens à l'aise avec les outils bureautiques (Excel, bases de données...).

### Scoring

```typescript
export interface ScoresRiasec { R: number; I: number; A: number; S: number; E: number; C: number; }

// somme des 10 réponses (1-5) par dimension → 10 à 50 par dimension
export function calculerScores(reponses: Record<number, number>): ScoresRiasec;

// 3 lettres aux scores les plus hauts, ordre décroissant ;
// égalité → ordre canonique R-I-A-S-E-C conservé
export function determinerCodeHolland(scores: ScoresRiasec): string; // ex. "ISA"
```

Chaque dimension a aussi un libellé, une courte description (teaser, libre)
et une description longue (verrouillée) dans `riasec-data.ts`, réutilisées à
la fois pour le rendu et pour construire le payload envoyé à l'API.

## 3. Classification RIASEC des 41 fiches métiers existantes

Nouvelle colonne `metier.riasec_codes` (1 à 3 lettres, ordre décroissant de
pertinence). Classification proposée pour les 41 lignes actuelles :

| id | Titre | Code | id | Titre | Code |
|---|---|---|---|---|---|
| 1 | Commerce | EC | 22 | Electronique | RI |
| 2 | Industrie | RC | 23 | Droit | EC |
| 3 | Informatique | IR | 24 | Management | ES |
| 4 | Social | SA | 25 | Culture | AS |
| 5 | Immobilier | EC | 26 | Marketing | EA |
| 6 | Agricole | RI | 27 | Restauration | RE |
| 7 | Banque | CE | 28 | Finance | CE |
| 8 | Communication | AE | 29 | Logistique | CR |
| 9 | Sante | SI | 30 | Agroalimentaire | RI |
| 10 | Tourisme | SE | 31 | Sciences Politique | SE |
| 11 | Environnement | IR | 32 | Administratif | C |
| 12 | Audiovisuel | AR | 33 | Beaute | AR |
| 13 | Art | AS | 34 | BTP | RC |
| 14 | Assurance | CE | 35 | Enseignement | SA |
| 15 | Hotellerie | SE | 36 | Ingenierie | RI |
| 16 | Automobile | RC | 37 | Langues | AS |
| 17 | Transport | RC | 38 | Securite | RC |
| 18 | Architecture | ARI | 39 | Digital | IA |
| 19 | Gestion | CE | 40 | Science | IR |
| 20 | Ressources humaine | SE | 41 | Artisanat | RA |
| 21 | Comptabilite | C | | | |

Matching côté API : score de pertinence = position pondérée des lettres du
code utilisateur retrouvées dans `riasec_codes` du métier (1ère lettre du
profil = poids 3, 2e = poids 2, 3e = poids 1), calculé en JS sur les 41
lignes (pas de requête SQL complexe), trié décroissant, top 8 renvoyés.

## 4. Modèle de données — migration `009_create_riasec.sql`

À exécuter manuellement sur `ecolecamerdb` (comme les migrations 005-008),
en local puis en production après validation.

```sql
-- ─────────────────────────────────────────────────────────────────────────
-- ÉTAPE 1 : classification RIASEC des fiches métiers existantes
-- ─────────────────────────────────────────────────────────────────────────
ALTER TABLE metier ADD COLUMN riasec_codes VARCHAR(6) NULL AFTER titre;

UPDATE metier SET riasec_codes = 'EC'  WHERE id_metier = 1;  -- Commerce
UPDATE metier SET riasec_codes = 'RC'  WHERE id_metier = 2;  -- Industrie
UPDATE metier SET riasec_codes = 'IR'  WHERE id_metier = 3;  -- Informatique
UPDATE metier SET riasec_codes = 'SA'  WHERE id_metier = 4;  -- Social
UPDATE metier SET riasec_codes = 'EC'  WHERE id_metier = 5;  -- Immobilier
UPDATE metier SET riasec_codes = 'RI'  WHERE id_metier = 6;  -- Agricole
UPDATE metier SET riasec_codes = 'CE'  WHERE id_metier = 7;  -- Banque
UPDATE metier SET riasec_codes = 'AE'  WHERE id_metier = 8;  -- Communication
UPDATE metier SET riasec_codes = 'SI'  WHERE id_metier = 9;  -- Sante
UPDATE metier SET riasec_codes = 'SE'  WHERE id_metier = 10; -- Tourisme
UPDATE metier SET riasec_codes = 'IR'  WHERE id_metier = 11; -- Environnement
UPDATE metier SET riasec_codes = 'AR'  WHERE id_metier = 12; -- Audiovisuel
UPDATE metier SET riasec_codes = 'AS'  WHERE id_metier = 13; -- Art
UPDATE metier SET riasec_codes = 'CE'  WHERE id_metier = 14; -- Assurance
UPDATE metier SET riasec_codes = 'SE'  WHERE id_metier = 15; -- Hotellerie
UPDATE metier SET riasec_codes = 'RC'  WHERE id_metier = 16; -- Automobile
UPDATE metier SET riasec_codes = 'RC'  WHERE id_metier = 17; -- Transport
UPDATE metier SET riasec_codes = 'ARI' WHERE id_metier = 18; -- Architecture
UPDATE metier SET riasec_codes = 'CE'  WHERE id_metier = 19; -- Gestion
UPDATE metier SET riasec_codes = 'SE'  WHERE id_metier = 20; -- Ressources humaine
UPDATE metier SET riasec_codes = 'C'   WHERE id_metier = 21; -- Comptabilite
UPDATE metier SET riasec_codes = 'RI'  WHERE id_metier = 22; -- Electronique
UPDATE metier SET riasec_codes = 'EC'  WHERE id_metier = 23; -- Droit
UPDATE metier SET riasec_codes = 'ES'  WHERE id_metier = 24; -- Management
UPDATE metier SET riasec_codes = 'AS'  WHERE id_metier = 25; -- Culture
UPDATE metier SET riasec_codes = 'EA'  WHERE id_metier = 26; -- Marketing
UPDATE metier SET riasec_codes = 'RE'  WHERE id_metier = 27; -- Restauration
UPDATE metier SET riasec_codes = 'CE'  WHERE id_metier = 28; -- Finance
UPDATE metier SET riasec_codes = 'CR'  WHERE id_metier = 29; -- Logistique
UPDATE metier SET riasec_codes = 'RI'  WHERE id_metier = 30; -- Agroalimentaire
UPDATE metier SET riasec_codes = 'SE'  WHERE id_metier = 31; -- Sciences Politique
UPDATE metier SET riasec_codes = 'C'   WHERE id_metier = 32; -- Administratif
UPDATE metier SET riasec_codes = 'AR'  WHERE id_metier = 33; -- Beaute
UPDATE metier SET riasec_codes = 'RC'  WHERE id_metier = 34; -- BTP
UPDATE metier SET riasec_codes = 'SA'  WHERE id_metier = 35; -- Enseignement
UPDATE metier SET riasec_codes = 'RI'  WHERE id_metier = 36; -- Ingenierie
UPDATE metier SET riasec_codes = 'AS'  WHERE id_metier = 37; -- Langues
UPDATE metier SET riasec_codes = 'RC'  WHERE id_metier = 38; -- Securite
UPDATE metier SET riasec_codes = 'IA'  WHERE id_metier = 39; -- Digital
UPDATE metier SET riasec_codes = 'IR'  WHERE id_metier = 40; -- Science
UPDATE metier SET riasec_codes = 'RA'  WHERE id_metier = 41; -- Artisanat

-- ─────────────────────────────────────────────────────────────────────────
-- ÉTAPE 2 : table des résultats de test, liée à un prospect (clients)
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE riasec_results (
  id_riasec    INT AUTO_INCREMENT PRIMARY KEY,
  client_id    INT NOT NULL,
  score_r      INT NOT NULL,
  score_i      INT NOT NULL,
  score_a      INT NOT NULL,
  score_s      INT NOT NULL,
  score_e      INT NOT NULL,
  score_c      INT NOT NULL,
  code_riasec  VARCHAR(6) NOT NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_riasec_client FOREIGN KEY (client_id) REFERENCES clients(id_client)
);
```

Pas de modification de `clients` (colonnes déjà suffisantes, voir §5) ni de
`save_client_procedure`.

## 5. Nouvelle route backend — `POST /api/riasec/submit`

Nouveau fichier `ec_back/routes/riasec.js`, monté dans `app.js` :
```js
const riasecRoutes = require('./routes/riasec');
app.use('/api/riasec', riasecRoutes);
```

Pas d'authentification (route publique, comme `/api/result`).

**Requête :**
```json
{
  "name": "Fondja",
  "surname": "Jalil",
  "tel": "+237600000000",
  "email": "jalil@example.com",
  "statuts": "lycéen",
  "bornDate": "2007",
  "scores": { "r": 32, "i": 41, "a": 28, "s": 35, "e": 22, "c": 30 }
}
```
Validation (même style que `routes/advisor.js` POST `/lead`) : `name`,
`surname`, `tel` requis (chaînes non vides) ; `scores` requis avec les 6 clés
numériques. `email`, `statuts`, `bornDate` optionnels (chaîne vide si
absents).

**Traitement :**
1. INSERT direct dans `clients` (même forme que `routes/resultats.js`
   aujourd'hui) : `nom_c, prenom_c, statut_c, naissance_c, email_c, tel_c,
   created_at, p_source` = `'riasec_test'` ; `ville_cible`, `diplome_cible`,
   `domaine_cible` laissés vides (non pertinents pour ce lead).
2. `code_riasec` calculé côté serveur à partir de `scores` (le client
   n'envoie jamais de code — seulement les 6 scores bruts).
3. INSERT dans `riasec_results` avec `client_id = insertId` de l'étape 1.
4. `SELECT id_metier, titre, riasec_codes FROM metier` (41 lignes), calcul
   de pertinence en JS contre `code_riasec`, tri, top 8.

**Réponse (201) :**
```json
{
  "success": true,
  "client_id": 109,
  "id_riasec": 1,
  "code_riasec": "ISA",
  "metiers": [
    { "id_metier": 3, "titre": "Informatique", "pertinence": 3 }
  ]
}
```
Erreurs : 400 (validation), 500 (`{ error: 'Erreur serveur' }`, pattern
existant).

## 6. Changements frontend

- `test.component.ts` : state machine 3 phases, logique quiz (progression,
  navigation), formulaire lead (mêmes champs/validations qu'orientation-v2 :
  nom, prénom, téléphone requis via `ngx-intl-tel-input` ; email optionnel
  en input texte ; statut et année de naissance optionnels via
  `p-dropdown`), appel `POST /api/riasec/submit`,
  `ChangeDetectionStrategy.OnPush` + `ChangeDetectorRef.markForCheck()`.
- `test.component.html` : template des 3 phases. Dans le sous-état teaser,
  le graphique radar (`p-chart` PrimeNG, `type="radar"`, données = les 6
  scores normalisés en %) et le nom du profil dominant sont affichés en
  clair ; seuls le bloc description détaillée et la grille des métiers
  suggérés sont visuellement verrouillés (flou + overlay) jusqu'à la
  soumission du formulaire.
- `test.component.scss` : styles quiz (carte question, boutons échelle 1-5,
  barre de progression), styles résultat (teaser flouté, radar, grille
  métiers) — cohérents avec le design system (`@import 'design-system'`).
- **Nouveau** `riasec-data.ts` (co-localisé dans le dossier `test/`) : 60
  questions, métadonnées par dimension (libellé, description courte/longue,
  icône Bootstrap Icons, couleur — réutilise les couleurs déjà définies dans
  `test.component.scss` pour les badges R/I/A/S/E/C), `calculerScores()`,
  `determinerCodeHolland()`.
- **Nouveau** `shared/utils/phone-validation.util.ts` : extraction de
  `numeroCamerounaisPlausible()` / la logique de `telephoneInvalide()`
  actuellement dupliquée dans `orientation-v2.component.ts` — réutilisée par
  les deux formulaires lead. `orientation-v2.component.ts` est mis à jour
  pour utiliser cet utilitaire (petit refactor, comportement inchangé).
- `package.json` : ajout de la dépendance `chart.js` (peer dependency de
  `p-chart`, module `primeng/chart` déjà inclus dans le paquet `primeng`
  existant).

## 7. Nettoyage du contenu existant (phase 'intro')

- Retrait du bouton "Simulation rapide (admin)" du hero (aucune logique
  admin réelle ne l'accompagne aujourd'hui).
- Les 6 cartes "profils RIASEC" perdent leur `href` vers
  `/test-orientation/profil-*` (routes inexistantes) — elles deviennent des
  cartes informatives non cliquables, ou scrollent vers l'ancre du test.
- Liens `/guide-metiers` → repointés vers `/info/metier` (route réelle).
- Liens `/bilan-de-competences` et `/reconversion-professionnelle` (aucun
  équivalent réel dans l'app) retirés de la section "Nos guides complets" ;
  la section conserve "Guide des Métiers" (`/info/metier`) et "Test
  d'Orientation" (ancre vers le haut de la page) et gagne une carte "Trouver
  ma formation" (`/trouver-ma-formation`).

## Hors périmètre

- Pas de dashboard admin/modérateur pour consulter les résultats RIASEC ou
  les leads (`clients`) — aucun lead, RIASEC ou autre, n'est visible dans le
  back-office actuel ; pas de précédent créé ici.
- Pas de lien entre le code RIASEC et les `domaines`/`formations` (mapping
  jugé trop imprécis pour ~90 domaines contre 41 secteurs métiers) — le seul
  pont vers le catalogue de formations est le CTA générique "Trouver ma
  formation".
- Pas de back-office pour éditer les 60 questions ou la classification
  métiers (contenu statique versionné dans le code).
- Pas de stockage des 60 réponses individuelles.
- Pas de modification de `routes/resultats.js` ni de `save_client_procedure`.

## Tests / vérification

- Fonctions pures `calculerScores()` / `determinerCodeHolland()` : tests
  unitaires Jasmine (cas simples + égalités de score).
- Validation manuelle en navigateur (`npm start`) : parcours complet
  intro → 60 réponses → teaser → formulaire → déblocage, sur un cas nominal
  et un cas de refus réseau (DevTools offline) pour vérifier le
  déblocage-sans-faux-succès.
- Vérification en base (dev local) après un passage de test : nouvelle ligne
  `clients` (`p_source = 'riasec_test'`) et nouvelle ligne `riasec_results`
  avec le `client_id` correspondant.
- Vérification que les métiers renvoyés par l'API correspondent bien aux
  lettres dominantes du profil testé (quelques cas manuels croisés avec le
  tableau du §3).

## Notes de déploiement (backend + BDD)

À exécuter manuellement en production, dans cet ordre :

1. `git pull` sur `ec_back` (nouveau fichier `routes/riasec.js`, `app.js`
   modifié) et `cd2front` (nouveau `riasec-data.ts`, `phone-validation.util.ts`,
   composant `test` modifié, `package.json` modifié).
2. `npm install` dans `cd2front` (nouvelle dépendance `chart.js`).
3. Exécuter `ec_back/migrations/009_create_riasec.sql` sur la base de
   production (ALTER + 41 UPDATE + CREATE TABLE — aucune donnée existante
   modifiée hors la nouvelle colonne `metier.riasec_codes`).
4. Redémarrer le serveur Node (`ec_back`) pour charger la nouvelle route.
5. Rebuild/redéployer `cd2front`.

Aucune nouvelle variable d'environnement requise. Aucune modification d'une
table ou procédure existante utilisée par d'autres flux (le tunnel
`/orientation` et `orientation-v2` ne sont pas touchés).
