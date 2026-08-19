# Design — Qualification enrichie du lead dans orientation-v2

Date : 2026-08-19
Composant concerné : `src/app/orientation-v2/orientation-v2.component.ts` (+ `.html`)

## Contexte

Le formulaire de capture lead affiché en Phase C du workflow `orientation-v2`
(`/trouver-ma-formation`) ne collecte aujourd'hui que : nom, prénom, téléphone,
email. La ville et le domaine sont déjà connus (choisis en Phase A/B).

En comparant avec la table `clients` en base (voir `ec_back/CLAUDE.md` section
14 et le payload `UserProfil` du tunnel V1), plusieurs colonnes utiles à la
qualification du prospect restent vides à chaque soumission depuis
orientation-v2 : `statut_c`, `naissance_c`, `diplome_cible`.

Objectif : collecter ces informations dans le même formulaire, sans ajouter
d'étape, pour permettre une meilleure qualification CRM des leads.

## Portée

- Uniquement `orientation-v2` (composant standalone, route `/trouver-ma-formation`).
- Aucun changement backend : la procédure `save_client_procedure` et la table
  `clients` acceptent déjà ces colonnes (utilisées par le tunnel V1).
- Le champ `level` (`niveau_c`, ex: "Terminale", "Bac+2") reste hors périmètre —
  seul le `statut` (catégorie large) est demandé, pas le niveau scolaire précis.

## Champs ajoutés

| Champ | Type UI | Obligatoire | Source des options | Colonne `clients` |
|---|---|---|---|---|
| Diplôme cible | `p-dropdown` | **Oui** | `GET /api/categ` (même source que `AdvisorService`) | `diplome_cible` |
| Statut | `p-dropdown` | **Oui** | Liste fixe : Lycéen/Collégien, Étudiant, En activité, Sans emploi (mêmes libellés que `StatutsComponent` du tunnel V1) | `statut_c` |
| Année de naissance | `p-dropdown` | Non | Années 1970–2009 (même range que `ContactComponent` V1) | `naissance_c` |

## Changements composant (`orientation-v2.component.ts`)

### Nouvel état

```typescript
leadDiplome: OptionSelect | null = null;
leadStatut: OptionSelect | null  = null;
leadAnnee: OptionSelect | null   = null;

categoriesOptions: OptionSelect[] = [];

readonly statutsOptions: OptionSelect[] = [
  { label: 'Lycéen / Collégien', value: 'lycéen' },
  { label: 'Étudiant',           value: 'étudiant' },
  { label: 'En activité',        value: 'en activité' },
  { label: 'Sans emploi',        value: 'sans emploi' },
];

readonly anneesOptions: OptionSelect[]; // généré une fois : 2009 → 1970 décroissant
```

`anneesOptions` est construit une seule fois (propriété initialisée en dehors
du cycle de détection, pas dans `ngOnInit`) via une boucle simple, valeurs en
`string` (le payload existant envoie déjà `bornDate` en `VARCHAR` côté
procédure).

### Chargement des catégories

- Nouvelle méthode `chargerCategories()`, appelée dans `ngOnInit()` en
  parallèle de `chargerVilles()` (pas de dépendance entre les deux).
- Appelle `GET {apiBase}/api/categ`, retourne `{ nom_cat: string }[]`, mappé
  en `OptionSelect[]` (`label` = `value` = `nom_cat`).
- Pas de spinner dédié : le dropdown affiche un placeholder
  ("Chargement..." / liste vide) le temps de la réponse — l'appel est rapide
  et non bloquant pour les Phases A/B qui ne dépendent pas de cette donnée.

### Soumission (`soumettreLead()`)

- Payload étendu :
  - `degree: this.leadDiplome?.value ?? ''`
  - `statuts: this.leadStatut?.value ?? ''`
  - `bornDate: this.leadAnnee?.value ?? 0` (reste `0` si non renseigné, comme
    aujourd'hui)
- Garde d'entrée de la méthode étendue : `leadDiplome` et `leadStatut`
  deviennent obligatoires au même titre que nom/prénom/téléphone.
- Bouton "Débloquer"/"Voir mes résultats" : `[disabled]` étendu avec
  `|| !leadDiplome || !leadStatut`.

### Reset (`nouvelleRecherche()`)

Les 3 nouveaux champs (`leadDiplome`, `leadStatut`, `leadAnnee`) sont remis à
`null` comme les autres champs du formulaire lead. `categoriesOptions` n'est
**pas** rechargé (déjà en cache, pas de raison de le vider).

## Changements template (`orientation-v2.component.html`)

3 nouveaux blocs `.form-group` insérés dans `.form-lead`, entre le champ
téléphone et le champ email :

1. Diplôme cible — `p-dropdown` avec astérisque requis, `[options]="categoriesOptions"`,
   `[(ngModel)]="leadDiplome"`, `optionLabel="label"`.
2. Statut — `p-dropdown` avec astérisque requis, `[options]="statutsOptions"`,
   `[(ngModel)]="leadStatut"`, `optionLabel="label"`.
3. Année de naissance — `p-dropdown` sans astérisque (optionnel), libellé
   `(optionnel)` comme le champ email actuel, `[options]="anneesOptions"`,
   `[(ngModel)]="leadAnnee"`, `optionLabel="label"`.

Style et structure identiques aux `form-group` existants (mêmes classes
labels), avec une classe `lead-dropdown` dédiée sur chaque `p-dropdown` (SCSS
ajouté dans `orientation-v2.component.scss` pour les faire correspondre à la
largeur/hauteur des `input.form-control` déjà présents dans `.form-lead`).

## Hors périmètre

- Pas de changement backend (les colonnes et la procédure existent déjà).
- Pas de changement au tunnel V1 (`/orientation/*`).
- Le champ `level`/`niveau_c` n'est pas collecté par ce formulaire.
- Pas de validation de cohérence entre `degree` choisi ici et le `domaine`/
  `ville` déjà sélectionnés en Phase A/B (aucune contrainte croisée demandée).

## Tests / vérification

- Validation manuelle : soumettre le formulaire avec/sans les champs
  optionnels, vérifier le payload envoyé à `POST /api/result` (DevTools
  Network) contient bien `degree`, `statuts`, `bornDate` renseignés.
- Vérifier en base (table `clients`) qu'une nouvelle ligne de test contient
  les valeurs attendues dans `diplome_cible`, `statut_c`, `naissance_c`.
- Vérifier que le bouton de soumission reste désactivé tant que Diplôme cible
  ou Statut ne sont pas sélectionnés.
