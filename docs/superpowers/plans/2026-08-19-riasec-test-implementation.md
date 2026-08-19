# Intégration du test RIASEC — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le composant statique `/orientation/test` en un vrai test RIASEC de 60 questions, dont le résultat est lié à un prospect (`clients`) enregistré en base via le même mécanisme de capture de lead que `orientation-v2`.

**Architecture:** `TestComponent` devient une state machine à 3 phases (`intro` → `quiz` → `resultat`), standalone, `OnPush`, sur le modèle d'`OrientationV2Component`. Une nouvelle route backend `POST /api/riasec/submit` enregistre le lead + le résultat et renvoie des fiches métiers réelles suggérées. Voir le design complet : `cd2front/docs/superpowers/specs/2026-08-19-riasec-test-design.md`.

**Tech Stack:** Angular 17 standalone components, PrimeNG (`p-chart`/Chart.js, `p-dropdown`, `p-progressSpinner`), `ngx-intl-tel-input` ; Express + `mysql2` + `sql-template-strings` côté backend ; MySQL.

## Global Constraints

- Tout le texte visible par l'utilisateur est en français.
- Ne pas modifier `ec_back/routes/resultats.js` ni la stored procedure `save_client_procedure` (fragile, déjà corrigée 2 fois — voir migrations 007/008).
- Pas de table pour les 60 questions : contenu statique versionné dans `cd2front` (`riasec-data.ts`).
- Pas de stockage des réponses individuelles : seuls les 6 scores agrégés + le code Holland sont persistés.
- Toutes les requêtes SQL backend paramétrées via `sql-template-strings` (`` SQL`...` ``) — jamais de concaténation de chaînes SQL.
- Pas de nouveau framework de test backend : vérification manuelle (curl + lecture DB), comme le reste d'`ec_back` (`npm test` non configuré).
- `TestComponent` reste `standalone: true`, `ChangeDetectionStrategy.OnPush`, avec `ChangeDetectorRef.markForCheck()` après chaque changement d'état asynchrone.
- La migration SQL (`009_create_riasec.sql`) est appliquée manuellement (comme 005-008) — jamais via un script automatisé committé au repo.
- Suivre les conventions de nommage existantes : colonnes `id_` + abréviation, FK `nom_entite_id`.

---

## Task 1: Migration base de données — classification métiers + table des résultats

**Repo:** `ec_back`

**Files:**
- Create: `ec_back/migrations/009_create_riasec.sql`

**Interfaces:**
- Produces: colonne `metier.riasec_codes` (VARCHAR(6)) ; table `riasec_results(id_riasec, client_id, score_r, score_i, score_a, score_s, score_e, score_c, code_riasec, created_at)` avec FK `client_id → clients.id_client`.

- [ ] **Step 1: Créer le fichier de migration**

Créer `ec_back/migrations/009_create_riasec.sql` avec le contenu exact suivant :

```sql
-- Script : 009_create_riasec.sql
-- À exécuter manuellement sur ecolecamerdb (comme 005-008)
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

- [ ] **Step 2: Appliquer la migration sur la base de développement locale**

`ec_back/db.js` exporte déjà un pool `mysql2` configuré avec `multipleStatements: true` (nécessaire pour exécuter tout le fichier en une fois). Depuis `ec_back/` :

```bash
node -e "
require('dotenv').config();
const fs = require('fs');
const con = require('./db');
const sql = fs.readFileSync('./migrations/009_create_riasec.sql', 'utf8');
con.query(sql, (err, results) => {
  if (err) { console.error('MIGRATION FAILED:', err.message); process.exit(1); }
  console.log('Migration OK — statements executed:', Array.isArray(results) ? results.length : 1);
  process.exit(0);
});
"
```

Expected: `Migration OK — statements executed: 43` (1 ALTER + 41 UPDATE + 1 CREATE TABLE = 43 — le driver peut regrouper différemment selon la version de `mysql2`, le signal fiable est surtout l'absence de `MIGRATION FAILED` ; le Step 3 ci-dessous vérifie le résultat réel indépendamment de ce compte).

- [ ] **Step 3: Vérifier le schéma résultant**

```bash
node -e "
require('dotenv').config();
const con = require('./db');
con.query('DESCRIBE riasec_results', (e1, r1) => {
  console.log('riasec_results:', r1.map(c => c.Field));
  con.query('SELECT id_metier, titre, riasec_codes FROM metier WHERE id_metier IN (1,18,41)', (e2, r2) => {
    console.log('spot-check:', r2);
    process.exit(0);
  });
});
"
```

Expected : `riasec_results` liste les 10 colonnes attendues ; le spot-check renvoie `Commerce/EC`, `Architecture/ARI`, `Artisanat/RA`.

- [ ] **Step 4: Commit**

```bash
cd ec_back
git add migrations/009_create_riasec.sql
git commit -m "$(cat <<'EOF'
feat(db): add riasec_results table and metier RIASEC classification

Migration 009 tags the 41 existing metier sector rows with a RIASEC
code and creates riasec_results (FK to clients) to persist RIASEC
test outcomes. Must be applied manually in production per the
existing migration convention (005-008).
EOF
)"
```

**⚠️ Note de déploiement : cette migration doit être exécutée manuellement sur la base de production avant de déployer le backend de la Task 2.**

---

## Task 2: Route backend `POST /api/riasec/submit`

**Repo:** `ec_back`

**Files:**
- Create: `ec_back/routes/riasec.js`
- Modify: `ec_back/app.js` (montage de la route, après le bloc `chatbotMatchRoutes` ligne ~209)

**Interfaces:**
- Consumes: table `clients` (colonnes existantes), table `riasec_results` et colonne `metier.riasec_codes` (Task 1).
- Produces: `POST /api/riasec/submit` → `{ success, client_id, id_riasec, code_riasec, metiers: [{id_metier, titre, pertinence}] }`. Ce contrat est consommé par le frontend en Task 6.

- [ ] **Step 1: Créer la route**

Créer `ec_back/routes/riasec.js` :

```javascript
const express = require('express');
const router = express.Router();
const con = require('../db');
const SQL = require('sql-template-strings');

const RIASEC_LETTERS = ['R', 'I', 'A', 'S', 'E', 'C'];

// Même règle de départage qu'en frontend (determinerCodeHolland dans
// riasec-data.ts) : ordre canonique R-I-A-S-E-C en cas d'égalité de score,
// explicite plutôt que de compter sur la stabilité du tri du moteur JS —
// le code recalculé ici doit être identique à celui déjà affiché au client
// avant soumission (le serveur ne fait pas confiance à un code envoyé par
// le client, mais son propre calcul doit rester déterministe et cohérent).
function calculerCodeRiasec(scores) {
    return [...RIASEC_LETTERS]
        .sort((a, b) => {
            const diff = scores[b.toLowerCase()] - scores[a.toLowerCase()];
            return diff !== 0 ? diff : RIASEC_LETTERS.indexOf(a) - RIASEC_LETTERS.indexOf(b);
        })
        .slice(0, 3)
        .join('');
}

function calculerMetiersSuggeres(metiers, code) {
    const lettres = code.split('');
    const poids = [3, 2, 1];
    return metiers
        .map((m) => {
            const codes = (m.riasec_codes || '').split('');
            let pertinence = 0;
            lettres.forEach((lettre, i) => {
                if (codes.includes(lettre)) pertinence += poids[i];
            });
            return { id_metier: m.id_metier, titre: m.titre, pertinence };
        })
        .filter((m) => m.pertinence > 0)
        .sort((a, b) => b.pertinence - a.pertinence)
        .slice(0, 8);
}

// ─────────────────────────────────────────────────────────────────────────
// POST /api/riasec/submit — Enregistrement d'un lead + résultat de test RIASEC
// Utilise con.promisePool (interface Promise déjà exportée par db.js, jusque
// là utilisée uniquement par le module auth) pour enchaîner proprement les
// 3 opérations séquentielles (insert client, insert résultat, lecture métiers)
// sans empiler des callbacks.
// ─────────────────────────────────────────────────────────────────────────
router.post('/submit', async (req, res) => {
    const { name, surname, tel, email, statuts, bornDate, scores } = req.body;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Le champ "name" (nom) est requis.' });
    }
    if (!surname || typeof surname !== 'string' || surname.trim() === '') {
        return res.status(400).json({ error: 'Le champ "surname" (prénom) est requis.' });
    }
    if (!tel || typeof tel !== 'string' || tel.trim() === '') {
        return res.status(400).json({ error: 'Le champ "tel" (téléphone) est requis.' });
    }
    if (!scores || typeof scores !== 'object') {
        return res.status(400).json({ error: 'Le champ "scores" est requis.' });
    }
    for (const lettre of ['r', 'i', 'a', 's', 'e', 'c']) {
        if (typeof scores[lettre] !== 'number' || Number.isNaN(scores[lettre])) {
            return res.status(400).json({ error: `Le score "${lettre}" est manquant ou invalide.` });
        }
    }

    const safeEmail   = email   || '';
    const safeStatuts = statuts || '';
    const safeBorn    = bornDate || '';
    const nom         = name.trim();
    const prenom      = surname.trim();
    const telephone   = tel.trim();

    try {
        const [clientResult] = await con.promisePool.query(SQL`
            INSERT INTO clients
                (nom_c, prenom_c, statut_c, naissance_c, email_c, tel_c, created_at, p_source)
            VALUES
                (${nom}, ${prenom}, ${safeStatuts}, ${safeBorn}, ${safeEmail}, ${telephone}, NOW(), ${'riasec_test'})
        `);
        const clientId = clientResult.insertId;

        const code = calculerCodeRiasec(scores);

        const [riasecResult] = await con.promisePool.query(SQL`
            INSERT INTO riasec_results
                (client_id, score_r, score_i, score_a, score_s, score_e, score_c, code_riasec)
            VALUES
                (${clientId}, ${scores.r}, ${scores.i}, ${scores.a}, ${scores.s}, ${scores.e}, ${scores.c}, ${code})
        `);

        const [metiers] = await con.promisePool.query(
            SQL`SELECT id_metier, titre, riasec_codes FROM metier`
        );
        const metiersSuggeres = calculerMetiersSuggeres(metiers, code);

        console.log('Résultat RIASEC enregistré, client_id=' + clientId);
        res.status(201).json({
            success: true,
            client_id: clientId,
            id_riasec: riasecResult.insertId,
            code_riasec: code,
            metiers: metiersSuggeres,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement du test." });
    }
});

module.exports = router;
```

- [ ] **Step 2: Monter la route dans `app.js`**

Dans `ec_back/app.js`, insérer juste avant le middleware d'erreur global (avant la ligne `app.use((err, req, res, next) => {` autour de la ligne 212), après le bloc `chatbotMatchRoutes` :

```javascript
 /** Module test RIASEC — enregistrement lead + résultat (public) **********/
 const riasecRoutes = require('./routes/riasec');
 app.use('/api/riasec', riasecRoutes);

```

- [ ] **Step 3: Vérification manuelle**

Démarrer le serveur backend (dans `ec_back/`) :

```bash
node server.js
```

Dans un second terminal, avec le serveur qui tourne :

```bash
curl -s -X POST http://localhost:3000/api/riasec/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","surname":"Riasec","tel":"+237670000000","email":"test@example.com","statuts":"étudiant","bornDate":"2003","scores":{"r":20,"i":45,"a":30,"s":38,"e":15,"c":22}}'
```

Expected : réponse HTTP 201, JSON `{"success":true,"client_id":<int>,"id_riasec":<int>,"code_riasec":"ISA","metiers":[...]}` (I=45, S=38, A=30 sont les 3 scores les plus hauts → code "ISA"). Les métiers renvoyés doivent inclure des secteurs classés I, S ou A (ex. Informatique "IR", Enseignement "SA").

Tester aussi un cas d'erreur de validation :

```bash
curl -s -X POST http://localhost:3000/api/riasec/submit \
  -H "Content-Type: application/json" \
  -d '{"name":"","surname":"Riasec","tel":"+237670000000","scores":{"r":20,"i":45,"a":30,"s":38,"e":15,"c":22}}'
```

Expected : HTTP 400, `{"error":"Le champ \"name\" (nom) est requis."}`.

Puis vérifier en base :

```bash
node -e "
require('dotenv').config();
const con = require('./db');
con.query('SELECT id_client, nom_c, prenom_c, p_source FROM clients ORDER BY id_client DESC LIMIT 1', (e, r) => {
  console.log('dernier client:', r);
  con.query('SELECT * FROM riasec_results ORDER BY id_riasec DESC LIMIT 1', (e2, r2) => {
    console.log('dernier résultat:', r2);
    process.exit(0);
  });
});
"
```

Expected : la dernière ligne `clients` a `p_source = 'riasec_test'`, `nom_c = 'Test'` ; la dernière ligne `riasec_results` a `code_riasec = 'ISA'` et le `client_id` correspondant.

Arrêter le serveur (`Ctrl+C`).

- [ ] **Step 4: Commit**

```bash
cd ec_back
git add routes/riasec.js app.js
git commit -m "$(cat <<'EOF'
feat(api): add POST /api/riasec/submit endpoint

Saves a RIASEC test lead into clients (p_source='riasec_test'),
persists the 6 aggregate scores + Holland code into riasec_results,
and returns matching real metier fiches ranked by RIASEC relevance.
Does not touch resultats.js or save_client_procedure.
EOF
)"
```

---

## Task 3: Extraction de la validation téléphone partagée

**Repo:** `cd2front`

**Files:**
- Create: `cd2front/src/app/shared/utils/phone-validation.util.ts`
- Create: `cd2front/src/app/shared/utils/phone-validation.util.spec.ts`
- Modify: `cd2front/src/app/orientation-v2/orientation-v2.component.ts`

**Interfaces:**
- Produces: `telephoneInvalide(telObj: TelephoneIntl | null | undefined): boolean`, interface `TelephoneIntl { e164Number?: string; countryCode?: string; }`. Consommé par `orientation-v2.component.ts` (ce task) et par `test.component.ts` (Task 6).

- [ ] **Step 1: Écrire le test (déplacé depuis la logique existante d'orientation-v2)**

Créer `cd2front/src/app/shared/utils/phone-validation.util.spec.ts` :

```typescript
import { telephoneInvalide } from './phone-validation.util';

describe('telephoneInvalide', () => {
  it('retourne false si telObj est null ou undefined', () => {
    expect(telephoneInvalide(null)).toBeFalse();
    expect(telephoneInvalide(undefined)).toBeFalse();
  });

  it('retourne false si e164Number est absent', () => {
    expect(telephoneInvalide({})).toBeFalse();
  });

  it('retourne false pour un mobile camerounais plausible (6XXXXXXXX)', () => {
    expect(telephoneInvalide({ e164Number: '+237670000000', countryCode: 'CM' })).toBeFalse();
  });

  it('retourne true pour un numéro camerounais trop court', () => {
    expect(telephoneInvalide({ e164Number: '+23767000', countryCode: 'CM' })).toBeTrue();
  });

  it('retourne true pour une entrée non parseable', () => {
    expect(telephoneInvalide({ e164Number: 'not-a-number', countryCode: 'CM' })).toBeTrue();
  });
});
```

- [ ] **Step 2: Run test pour vérifier qu'il échoue (module inexistant)**

```bash
cd cd2front
npx ng test --watch=false --include='**/phone-validation.util.spec.ts'
```

Expected: FAIL — `Cannot find module './phone-validation.util'`.

- [ ] **Step 3: Créer l'utilitaire**

Créer `cd2front/src/app/shared/utils/phone-validation.util.ts` (logique reprise à l'identique de `orientation-v2.component.ts`, extraite en fonction pure) :

```typescript
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

export interface TelephoneIntl {
  e164Number?: string;
  countryCode?: string;
}

// Les métadonnées embarquées dans google-libphonenumber (dépendance de
// ngx-intl-tel-input) ne couvrent pas encore les tranches mobiles 63X/64X
// attribuées par l'ART au Cameroun : isValidNumber() les rejette à tort.
// On retombe sur un contrôle de forme (9 chiffres, préfixe fixe "2" ou
// mobile "6") plutôt que sur la liste d'opérateurs figée de la lib.
function numeroCamerounaisPlausible(nationalNumber: string): boolean {
  return /^[26]\d{8}$/.test(nationalNumber);
}

export function telephoneInvalide(telObj: TelephoneIntl | null | undefined): boolean {
  if (!telObj?.e164Number) return false;
  try {
    const parsed = phoneUtil.parse(telObj.e164Number);
    if (phoneUtil.isValidNumber(parsed)) return false;
    if (telObj.countryCode === 'CM') {
      return !numeroCamerounaisPlausible(String(parsed.getNationalNumber()));
    }
    return true;
  } catch {
    return true;
  }
}
```

- [ ] **Step 4: Run test pour vérifier qu'il passe**

```bash
npx ng test --watch=false --include='**/phone-validation.util.spec.ts'
```

Expected: PASS (5 specs).

- [ ] **Step 5: Refactoriser `orientation-v2.component.ts` pour utiliser l'utilitaire**

Dans `cd2front/src/app/orientation-v2/orientation-v2.component.ts` :

Remplacer l'import :
```typescript
import { PhoneNumberUtil } from 'google-libphonenumber';
```
par :
```typescript
import { telephoneInvalide as estTelephoneInvalide } from '../shared/utils/phone-validation.util';
```

Supprimer ces membres de la classe (actuellement juste avant `soumettreLead()`) :
```typescript
  private readonly phoneUtil = PhoneNumberUtil.getInstance();

  // Les métadonnées embarquées dans google-libphonenumber (dépendance de
  // ngx-intl-tel-input) ne couvrent pas encore les tranches mobiles 63X/64X
  // attribuées par l'ART au Cameroun : isValidNumber() les rejette à tort.
  // On retombe sur un contrôle de forme (9 chiffres, préfixe fixe "2" ou
  // mobile "6") plutôt que sur la liste d'opérateurs figée de la lib.
  private numeroCamerounaisPlausible(nationalNumber: string): boolean {
    return /^[26]\d{8}$/.test(nationalNumber);
  }

  telephoneInvalide(): boolean {
    if (!this.leadTelObj?.e164Number) return false;
    try {
      const parsed = this.phoneUtil.parse(this.leadTelObj.e164Number);
      if (this.phoneUtil.isValidNumber(parsed)) return false;
      if (this.leadTelObj.countryCode === 'CM') {
        return !this.numeroCamerounaisPlausible(String(parsed.getNationalNumber()));
      }
      return true;
    } catch {
      return true;
    }
  }
```

Remplacer par :
```typescript
  telephoneInvalide(): boolean {
    return estTelephoneInvalide(this.leadTelObj);
  }
```

- [ ] **Step 6: Vérifier la compilation et la régression**

```bash
npx ng build --configuration development
npx ng test --watch=false --include='**/orientation-v2*.spec.ts'
```

Expected : build sans erreur ; specs existantes d'orientation-v2 toujours au vert (le comportement de `telephoneInvalide()` est inchangé, seule son implémentation a bougé).

Démarrer `npm start`, aller sur `/trouver-ma-formation`, avancer jusqu'au formulaire lead (phase C), saisir un numéro camerounais valide (ex: 6 70 00 00 00) puis un numéro trop court — vérifier que le message d'erreur "Numéro invalide..." apparaît/disparaît exactement comme avant.

- [ ] **Step 7: Commit**

```bash
cd cd2front
git add src/app/shared/utils/phone-validation.util.ts src/app/shared/utils/phone-validation.util.spec.ts src/app/orientation-v2/orientation-v2.component.ts
git commit -m "$(cat <<'EOF'
refactor: extract shared Cameroonian phone validation utility

telephoneInvalide() was duplicated logic living inside
OrientationV2Component. Extracted to shared/utils so the upcoming
RIASEC lead form (test.component.ts) can reuse it instead of
duplicating it a second time. Behavior unchanged.
EOF
)"
```

---

## Task 4: Contenu du test — 60 questions et fonctions de scoring

**Repo:** `cd2front`

**Files:**
- Create: `cd2front/src/app/orientation/components/test/riasec-data.ts`
- Create: `cd2front/src/app/orientation/components/test/riasec-data.spec.ts`

**Interfaces:**
- Produces: `type Dimension`, `interface Question`, `interface DimensionInfo`, `interface ScoresRiasec`, `RIASEC_QUESTIONS: Question[]` (60), `DIMENSIONS_INFO: Record<Dimension, DimensionInfo>`, `ORDRE_DIMENSIONS: Dimension[]`, `calculerScores(reponses: Record<number, number>): ScoresRiasec`, `determinerCodeHolland(scores: ScoresRiasec): string`, `scorePourcentage(score: number): number`. Consommé par `test.component.ts` (Tasks 5 et 6).

- [ ] **Step 1: Écrire les tests des fonctions de scoring**

Créer `cd2front/src/app/orientation/components/test/riasec-data.spec.ts` :

```typescript
import { calculerScores, determinerCodeHolland, RIASEC_QUESTIONS, ScoresRiasec } from './riasec-data';

describe('riasec-data', () => {
  it('RIASEC_QUESTIONS contient exactement 60 questions, 10 par dimension', () => {
    expect(RIASEC_QUESTIONS.length).toBe(60);
    for (const dim of ['R', 'I', 'A', 'S', 'E', 'C'] as const) {
      expect(RIASEC_QUESTIONS.filter(q => q.dimension === dim).length).toBe(10);
    }
  });

  it("chaque question a un id unique de 1 à 60", () => {
    const ids = RIASEC_QUESTIONS.map(q => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 60 }, (_, i) => i + 1));
  });

  describe('calculerScores', () => {
    it('additionne les réponses par dimension', () => {
      const reponses: Record<number, number> = {};
      RIASEC_QUESTIONS.forEach(q => { reponses[q.id] = q.dimension === 'R' ? 5 : 1; });
      const scores = calculerScores(reponses);
      expect(scores.R).toBe(50);
      expect(scores.I).toBe(10);
    });

    it('traite les réponses manquantes comme 0', () => {
      const scores = calculerScores({});
      expect(scores).toEqual({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
    });
  });

  describe('determinerCodeHolland', () => {
    it('retourne les 3 lettres aux scores les plus hauts, par ordre décroissant', () => {
      const scores: ScoresRiasec = { R: 10, I: 50, A: 40, S: 20, E: 30, C: 15 };
      expect(determinerCodeHolland(scores)).toBe('IAE');
    });

    it("utilise l'ordre canonique R-I-A-S-E-C en cas d'égalité", () => {
      const scores: ScoresRiasec = { R: 30, I: 30, A: 30, S: 10, E: 10, C: 10 };
      expect(determinerCodeHolland(scores)).toBe('RIA');
    });
  });
});
```

- [ ] **Step 2: Run test pour vérifier qu'il échoue**

```bash
cd cd2front
npx ng test --watch=false --include='**/riasec-data.spec.ts'
```

Expected: FAIL — `Cannot find module './riasec-data'`.

- [ ] **Step 3: Créer `riasec-data.ts`**

Créer `cd2front/src/app/orientation/components/test/riasec-data.ts` :

```typescript
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
```

- [ ] **Step 4: Run test pour vérifier qu'il passe**

```bash
npx ng test --watch=false --include='**/riasec-data.spec.ts'
```

Expected: PASS (6 specs).

- [ ] **Step 5: Commit**

```bash
cd cd2front
git add src/app/orientation/components/test/riasec-data.ts src/app/orientation/components/test/riasec-data.spec.ts
git commit -m "$(cat <<'EOF'
feat(riasec): add 60-item question bank and scoring functions

Original French RIASEC inventory (10 items x 6 dimensions), plus
pure functions to aggregate scores and derive the 3-letter Holland
code. Static content, no backend/DB dependency — consumed by
TestComponent (next tasks).
EOF
)"
```

---

## Task 5: `TestComponent` — nettoyage intro + moteur du quiz + résultat teaser

**Repo:** `cd2front`

**Files:**
- Modify: `cd2front/src/app/orientation/components/test/test.component.ts`
- Modify: `cd2front/src/app/orientation/components/test/test.component.html`
- Modify: `cd2front/src/app/orientation/components/test/test.component.scss`
- Modify: `cd2front/package.json` / `package-lock.json` (ajout `chart.js`)

**Interfaces:**
- Consumes: `RIASEC_QUESTIONS`, `DIMENSIONS_INFO`, `ORDRE_DIMENSIONS`, `ScoresRiasec`, `Dimension`, `calculerScores`, `determinerCodeHolland`, `scorePourcentage` (Task 4).
- Produces: `phase: 'intro' | 'quiz' | 'resultat'`, `demarrerTest()`, `scores: ScoresRiasec`, `codeRiasec: string`, `typeDominant: Dimension` — utilisés/étendus par Task 6.

- [ ] **Step 1: Installer `chart.js`**

```bash
cd cd2front
npm install chart.js
```

Expected : `chart.js` ajouté dans `dependencies` de `package.json`, `package-lock.json` mis à jour.

- [ ] **Step 2: Remplacer `test.component.ts`**

Remplacer l'intégralité du contenu de `cd2front/src/app/orientation/components/test/test.component.ts` par :

```typescript
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
```

- [ ] **Step 3: Remplacer `test.component.html`**

Remplacer l'intégralité du contenu de `cd2front/src/app/orientation/components/test/test.component.html` par :

```html
<!-- ═══════════════════════════════ PHASE INTRO ═══════════════════════════════ -->
<ng-container *ngIf="phase === 'intro'">

<!-- ===== HERO SECTION ===== -->
<section id="test-riasec-top" class="hero-riasec d-flex flex-column">
  <div class="flex-grow-1 d-flex align-items-center justify-content-center px-3 pb-5 pt-4">
    <div class="text-center text-white w-100" style="max-width: 640px;">

      <!-- Badges RIASEC -->
      <div class="d-flex justify-content-center flex-wrap mb-4">
        <span class="riasec-badge bg-danger">R</span>
        <span class="riasec-badge riasec-i">I</span>
        <span class="riasec-badge bg-warning">A</span>
        <span class="riasec-badge bg-primary">S</span>
        <span class="riasec-badge bg-success">E</span>
        <span class="riasec-badge riasec-c">C</span>
      </div>

      <h1 class="display-3 font-weight-bold mb-3">Test RIASEC</h1>
      <p class="hero-subtitle mb-1">Découvrez votre profil professionnel</p>
      <p class="hero-muted mb-4">60 questions pour identifier les métiers qui vous correspondent</p>

      <!-- Statistiques -->
      <div class="d-flex justify-content-center mb-4">
        <div class="mx-3 mx-sm-5">
          <div class="h2 font-weight-bold mb-0">60</div>
          <small class="hero-muted">questions</small>
        </div>
        <div class="mx-3 mx-sm-5">
          <div class="h2 font-weight-bold mb-0">10</div>
          <small class="hero-muted">minutes</small>
        </div>
        <div class="mx-3 mx-sm-5">
          <div class="h2 font-weight-bold mb-0">100%</div>
          <small class="hero-muted">gratuit</small>
        </div>
      </div>

      <!-- Bouton -->
      <button type="button" class="btn btn-hero-start btn-lg px-5 mb-3 d-block mx-auto" (click)="demarrerTest()">
        Commencer le test
      </button>
      <p class="mt-4 small hero-muted">
        Répondez spontanément, il n'y a pas de bonnes ou mauvaises réponses.
      </p>
    </div>
  </div>

  <!-- Flèche bas -->
  <div class="text-center pb-3 hero-arrow">
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
    </svg>
  </div>
</section>

<!-- ===== FIL D'ARIANE ===== -->
<div class="d-flex justify-content-center py-3">
  <nav aria-label="Fil d'Ariane">
    <ol class="breadcrumb breadcrumb-pill shadow-sm mb-0 px-4 py-2">
      <li class="breadcrumb-item">
        <a href="/" title="Accueil">
          <svg fill="currentColor" viewBox="0 0 20 20" width="14" height="14">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4
              10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011
              1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0
              001.414-1.414l-7-7z">
            </path>
          </svg>
        </a>
      </li>
      <li class="breadcrumb-item">
        <span>Tests Professionnels</span>
      </li>
      <li class="breadcrumb-item active" aria-current="page">Test RIASEC</li>
    </ol>
  </nav>
</div>

<!-- ===== SECTION DESCRIPTION ===== -->
<section class="bg-white py-5">
  <div class="container" style="max-width: 860px;">

    <!-- Qu'est-ce que le test RIASEC ? -->
    <h2 class="article-heading mb-4">Qu'est-ce que le test RIASEC&nbsp;?</h2>
    <p>
      Le <strong>test RIASEC</strong>, également appelé test de Holland, est un outil d'orientation
      professionnelle développé par le psychologue américain <strong>John L. Holland</strong> dans
      les années 1950. C'est l'un des modèles les plus utilisés au monde pour identifier les intérêts
      professionnels et trouver les métiers adaptés à chaque personnalité.
    </p>
    <p>
      Le modèle repose sur l'idée que les individus et les environnements de travail peuvent être
      classés selon <strong>6 types de personnalité</strong>, dont l'acronyme forme le mot RIASEC.
      Chaque personne présente une combinaison unique de ces 6 dimensions, avec généralement 2 à 3
      types dominants.
    </p>

    <!-- Les 6 profils -->
    <h3 class="font-weight-bold mt-5 mb-4">Les 6 profils du modèle RIASEC</h3>
    <div class="row">
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge bg-danger mr-3">R</div>
          <div>
            <div class="font-weight-bold text-dark">Réaliste</div>
            <small class="text-muted">Concret, manuel, technique</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge riasec-i mr-3">I</div>
          <div>
            <div class="font-weight-bold text-dark">Investigateur</div>
            <small class="text-muted">Analytique, scientifique</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge bg-warning mr-3">A</div>
          <div>
            <div class="font-weight-bold text-dark">Artistique</div>
            <small class="text-muted">Créatif, original</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge bg-primary mr-3">S</div>
          <div>
            <div class="font-weight-bold text-dark">Social</div>
            <small class="text-muted">À l'écoute, aidant</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge bg-success mr-3">E</div>
          <div>
            <div class="font-weight-bold text-dark">Entreprenant</div>
            <small class="text-muted">Persuasif, meneur</small>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 mb-3">
        <div class="profil-card d-flex align-items-center p-3 rounded">
          <div class="profil-badge riasec-c mr-3">C</div>
          <div>
            <div class="font-weight-bold text-dark">Conventionnel</div>
            <small class="text-muted">Organisé, méthodique</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Comment fonctionne le test ? -->
    <h2 class="article-heading mt-5 mb-4">Comment fonctionne notre test RIASEC gratuit&nbsp;?</h2>
    <p>
      Notre test RIASEC comprend <strong>60 affirmations</strong> (10 par dimension). Pour chaque
      affirmation, vous indiquez votre degré d'accord sur une échelle de 1 à 5. Il n'y a pas de
      bonnes ou mauvaises réponses : choisissez ce qui vous correspond le mieux spontanément.
    </p>
    <p>
      À la fin du test, vous obtenez votre <strong>profil RIASEC personnalisé</strong> avec un
      graphique radar, une description de vos types dominants, et une sélection de métiers
      compatibles parmi nos fiches métiers.
    </p>

    <!-- Bouton CTA -->
    <div class="text-center mt-5 mb-2">
      <button type="button" class="btn btn-riasec-cta btn-lg px-5" (click)="demarrerTest()">
        Commencer le test RIASEC
      </button>
    </div>

  </div>
</section>

<!-- ===== NOS GUIDES COMPLETS ===== -->
<div class="container py-5" style="max-width: 960px;">
  <div class="guides-section p-4 rounded border">
    <h3 class="font-weight-bold mb-4 d-flex align-items-center">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20" class="mr-2">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101
          m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1">
        </path>
      </svg>
      Nos guides complets
    </h3>
    <div class="row">
      <div class="col-12 col-md-4 mb-3">
        <a routerLink="/info/metier" class="guide-card d-flex align-items-center p-3 rounded border">
          <div class="guide-badge guide-gm mr-3">GM</div>
          <div>
            <div class="font-weight-semibold text-dark">Guide des Métiers</div>
            <small class="text-muted">Explorez nos fiches métiers</small>
          </div>
        </a>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <a href="#test-riasec-top" class="guide-card d-flex align-items-center p-3 rounded border">
          <div class="guide-badge guide-to mr-3">TO</div>
          <div>
            <div class="font-weight-semibold text-dark">Test d'Orientation</div>
            <small class="text-muted">Profil RIASEC gratuit</small>
          </div>
        </a>
      </div>
      <div class="col-12 col-md-4 mb-3">
        <a routerLink="/trouver-ma-formation" class="guide-card d-flex align-items-center p-3 rounded border">
          <div class="guide-badge guide-tf mr-3">TF</div>
          <div>
            <div class="font-weight-semibold text-dark">Trouver ma formation</div>
            <small class="text-muted">Écoles &amp; formations au Cameroun</small>
          </div>
        </a>
      </div>
    </div>
  </div>
</div>

</ng-container>

<!-- ═══════════════════════════════ PHASE QUIZ ═══════════════════════════════ -->
<section *ngIf="phase === 'quiz'" class="quiz-riasec py-5">
  <div class="container" style="max-width: 640px;">

    <div class="quiz-progress-wrapper mb-4">
      <div class="quiz-progress-bar">
        <div class="quiz-progress-fill" [style.width.%]="progression"></div>
      </div>
      <p class="quiz-progress-label">
        Question {{ questionActuelle + 1 }} / {{ totalQuestions }}
      </p>
    </div>

    <div class="quiz-carte">
      <p class="quiz-question">{{ question.texte }}</p>

      <div class="quiz-echelle" role="group" aria-label="Votre degré d'accord">
        <button
          *ngFor="let valeur of echelle"
          type="button"
          class="quiz-echelle-btn"
          [class.quiz-echelle-btn--active]="reponses[question.id] === valeur"
          (click)="repondre(valeur)">
          <span class="quiz-echelle-chiffre">{{ valeur }}</span>
          <span class="quiz-echelle-libelle">{{ libellesEchelle[valeur] }}</span>
        </button>
      </div>

      <button
        *ngIf="peutReculer"
        type="button"
        class="quiz-btn-precedent"
        (click)="questionPrecedente()">
        <i class="bi bi-arrow-left" aria-hidden="true"></i> Question précédente
      </button>
    </div>

  </div>
</section>

<!-- ═══════════════════════════════ PHASE RÉSULTAT ═══════════════════════════════ -->
<section *ngIf="phase === 'resultat'" class="resultat-riasec py-5">
  <div class="container" style="max-width: 720px;">

    <div class="resultat-entete text-center mb-4">
      <span class="resultat-badge" [ngClass]="'riasec-badge-' + typeDominant">{{ typeDominant }}</span>
      <h1 class="mt-3">Vous êtes plutôt <strong>{{ dimensionsInfo[typeDominant].nom }}</strong></h1>
      <p class="resultat-code">Votre code RIASEC : <strong>{{ codeRiasec }}</strong></p>
      <p class="resultat-description">{{ dimensionsInfo[typeDominant].description }}</p>
    </div>

    <div class="resultat-radar-wrapper mb-4">
      <p-chart
        type="radar"
        [data]="radarData"
        [options]="radarOptions"
        [style]="{width: '100%', maxWidth: '420px', margin: '0 auto', display: 'block'}">
      </p-chart>
    </div>

    <div class="text-center">
      <button type="button" class="btn-riasec-cta" (click)="refaireLeTest()">
        <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
        Refaire le test
      </button>
    </div>

  </div>
</section>
```

- [ ] **Step 4: Ajouter les styles quiz + résultat + guides**

Ajouter à la fin de `cd2front/src/app/orientation/components/test/test.component.scss` (après la règle `@media (max-width: 767px) { ... }` existante) :

```scss

/* ===== NOUVELLE CARTE GUIDE "Trouver ma formation" ===== */
.guide-tf { background-color: #0ea5e9; }

/* ===== QUIZ ===== */
.quiz-riasec {
  min-height: 60vh;
  background: #f9fafb;
}

.quiz-progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.quiz-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  transition: width 0.3s ease;
}

.quiz-progress-label {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
  margin-top: 8px;
}

.quiz-carte {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 32px 24px;
}

.quiz-question {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  margin-bottom: 28px;
}

.quiz-echelle {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.quiz-echelle-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  text-align: left;
  transition: border-color 0.15s, background-color 0.15s;

  &:hover {
    border-color: #c4b5fd;
    background: #f5f3ff;
  }

  &--active {
    border-color: #7c3aed;
    background: #f5f3ff;
  }
}

.quiz-echelle-chiffre {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 50%;
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 700;
  font-size: 0.875rem;
}

.quiz-echelle-libelle {
  color: #374151;
}

.quiz-btn-precedent {
  display: block;
  margin: 24px auto 0;
  background: none;
  border: none;
  color: #6d28d9;
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
}

/* ===== RÉSULTAT ===== */
.resultat-riasec {
  min-height: 60vh;
}

.resultat-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
}

.riasec-badge-R { background-color: #dc3545; }
.riasec-badge-I { background-color: #8b5cf6; }
.riasec-badge-A { background-color: #ffc107; }
.riasec-badge-S { background-color: #007bff; }
.riasec-badge-E { background-color: #28a745; }
.riasec-badge-C { background-color: #f97316; }

.resultat-code {
  color: #6d28d9;
  font-weight: 600;
}

.resultat-description {
  color: #4b5563;
  max-width: 480px;
  margin: 0 auto;
}

.resultat-radar-wrapper {
  display: flex;
  justify-content: center;
}
```

- [ ] **Step 5: Vérification manuelle en navigateur**

```bash
npm start
```

Ouvrir `http://localhost:4200/orientation/test`. Vérifier :
1. Le hero affiche bien le contenu habituel, sans le bouton "Simulation rapide (admin)".
2. Les 6 cartes "profils RIASEC" ne sont plus des liens cliquables (curseur normal, pas de navigation).
3. Cliquer sur "Commencer le test" (hero) → bascule sur la question 1/60 avec une barre de progression à 0%.
4. Répondre à quelques questions → la barre avance, "Question précédente" apparaît dès la 2e question et permet de revenir en arrière.
5. Répondre aux 60 questions (cliquer rapidement) → à la 60e réponse, bascule automatiquement sur l'écran résultat.
6. L'écran résultat affiche un badge coloré avec une lettre, un nom de profil dominant plausible, le code à 3 lettres, et un radar à 6 axes qui se dessine correctement.
7. "Refaire le test" ramène à la phase intro.
8. Dans la section "Nos guides complets" en bas de la page intro, vérifier que "Guide des Métiers" mène bien à `/info/metier` et que "Test d'Orientation" scrolle en haut de la page courante.

Arrêter le serveur (`Ctrl+C`).

- [ ] **Step 6: Commit**

```bash
cd cd2front
git add package.json package-lock.json src/app/orientation/components/test/test.component.ts src/app/orientation/components/test/test.component.html src/app/orientation/components/test/test.component.scss
git commit -m "$(cat <<'EOF'
feat(riasec): wire up the 60-question quiz engine and teaser result

TestComponent becomes a 3-phase (intro/quiz/resultat) standalone
OnPush component. Scores and the Holland code are computed entirely
client-side. Also strips the dead admin-simulation button and the
links to non-existent routes from the intro content. Lead capture
and backend persistence land in the next task.
EOF
)"
```

---

## Task 6: `TestComponent` — capture du lead, sauvegarde backend, déblocage du rapport complet

**Repo:** `cd2front`

**Dépend de:** Task 1 et Task 2 (route backend + table en place, pour tester le POST), Task 3 (utilitaire téléphone), Task 5 (composant de base).

**Files:**
- Modify: `cd2front/src/app/orientation/components/test/test.component.ts` (remplacement intégral — supersède le fichier produit en Task 5)
- Modify: `cd2front/src/app/orientation/components/test/test.component.html` (remplacement du seul bloc `<section *ngIf="phase === 'resultat'">` produit en Task 5)
- Modify: `cd2front/src/app/orientation/components/test/test.component.scss` (ajout en fin de fichier)

**Interfaces:**
- Consumes: `telephoneInvalide`, `TelephoneIntl` (Task 3) ; `POST {apiBase}/api/riasec/submit` → `{ success, client_id, id_riasec, code_riasec, metiers }` (Task 2).
- Produces: composant `TestComponent` dans sa forme finale — aucune tâche ultérieure n'en dépend.

- [ ] **Step 1: Remplacer intégralement `test.component.ts`**

Remplacer tout le contenu de `cd2front/src/app/orientation/components/test/test.component.ts` par :

```typescript
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

interface OptionSelect {
  label: string;
  value: string;
}

interface MetierSuggere {
  id_metier: number;
  titre: string;
  pertinence: number;
}

const SCORES_VIDES: ScoresRiasec = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

const STATUTS_OPTIONS: OptionSelect[] = [
  { label: 'Lycéen / Collégien', value: 'lycéen' },
  { label: 'Étudiant',           value: 'étudiant' },
  { label: 'En activité',        value: 'en activité' },
  { label: 'Sans emploi',        value: 'sans emploi' },
];

const ANNEES_OPTIONS: OptionSelect[] = Array.from(
  { length: 2009 - 1970 + 1 },
  (_, i) => {
    const annee = String(2009 - i);
    return { label: annee, value: annee };
  }
);

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
}
```

- [ ] **Step 2: Remplacer le bloc `phase === 'resultat'` dans `test.component.html`**

Dans `cd2front/src/app/orientation/components/test/test.component.html`, repérer le bloc produit en Task 5 :

```html
<!-- ═══════════════════════════════ PHASE RÉSULTAT ═══════════════════════════════ -->
<section *ngIf="phase === 'resultat'" class="resultat-riasec py-5">
  ...
</section>
```

(de `<!-- ═══════════════════════════════ PHASE RÉSULTAT ═══════════════════════════════ -->` jusqu'à la balise `</section>` fermante correspondante, en toute fin de fichier) et le remplacer entièrement par :

```html
<!-- ═══════════════════════════════ PHASE RÉSULTAT ═══════════════════════════════ -->
<section *ngIf="phase === 'resultat'" class="resultat-riasec py-5">
  <div class="container" style="max-width: 720px;">

    <div class="resultat-entete text-center mb-4">
      <span class="resultat-badge" [ngClass]="'riasec-badge-' + typeDominant">{{ typeDominant }}</span>
      <h1 class="mt-3">Vous êtes plutôt <strong>{{ dimensionsInfo[typeDominant].nom }}</strong></h1>
      <p class="resultat-code">Votre code RIASEC : <strong>{{ codeRiasec }}</strong></p>
      <p class="resultat-description">{{ dimensionsInfo[typeDominant].description }}</p>
    </div>

    <div class="resultat-radar-wrapper mb-4">
      <p-chart
        type="radar"
        [data]="radarData"
        [options]="radarOptions"
        [style]="{width: '100%', maxWidth: '420px', margin: '0 auto', display: 'block'}">
      </p-chart>
    </div>

    <!-- ── AVANT soumission lead : détails verrouillés + formulaire ─────── -->
    <ng-container *ngIf="!leadSoumis">

      <div class="zone-verrouillee mb-4" aria-hidden="true">
        <div class="verrou-flou">
          <div class="verrou-flou-item" *ngFor="let d of typesSecondaires">
            <h3>{{ dimensionsInfo[d].nom }}</h3>
            <p>{{ dimensionsInfo[d].descriptionLongue }}</p>
          </div>
        </div>
        <div class="verrou-masque"></div>
        <div class="verrou-message">
          <i class="bi bi-lock-fill" aria-hidden="true"></i>
          Remplissez le formulaire pour débloquer votre rapport complet et vos métiers suggérés
        </div>
      </div>

      <div class="carte-lead-riasec">
        <h2 class="lead-titre">Recevez votre rapport complet</h2>
        <p class="lead-description">
          Description détaillée de votre profil, métiers suggérés parmi nos fiches, et
          accompagnement gratuit par un conseiller.
        </p>

        <form (ngSubmit)="soumettreLead()" class="form-lead" novalidate>

          <div class="form-group">
            <label for="riasec-nom">Nom <span class="requis" aria-label="champ requis">*</span></label>
            <input id="riasec-nom" type="text" class="form-control" [(ngModel)]="leadNom" name="leadNom"
              placeholder="Votre nom" required aria-required="true" autocomplete="family-name" />
          </div>

          <div class="form-group">
            <label for="riasec-prenom">Prénom <span class="requis" aria-label="champ requis">*</span></label>
            <input id="riasec-prenom" type="text" class="form-control" [(ngModel)]="leadPrenom" name="leadPrenom"
              placeholder="Votre prénom" required aria-required="true" autocomplete="given-name" />
          </div>

          <div class="form-group">
            <label>Téléphone <span class="requis" aria-label="champ requis">*</span></label>
            <ngx-intl-tel-input
              [cssClass]="'form-control lead-tel-input'"
              [preferredCountries]="['cm', 'fr', 'sn', 'ci', 'ga', 'cd', 'ng']"
              [enableAutoCountrySelect]="false"
              [enablePlaceholder]="true"
              [searchCountryFlag]="true"
              [selectFirstCountry]="true"
              [phoneValidation]="false"
              [maxLength]="15"
              name="leadTel"
              [(ngModel)]="leadTelObj"
              #telCtrl="ngModel"
            ></ngx-intl-tel-input>
            <span *ngIf="telephoneInvalide() && (telCtrl.dirty || telCtrl.touched)" class="champ-erreur">
              <i class="bi bi-exclamation-circle" aria-hidden="true"></i>
              Numéro invalide pour le pays sélectionné
            </span>
          </div>

          <div class="form-group">
            <label for="riasec-statut">Statut <span class="optionnel">(optionnel)</span></label>
            <p-dropdown inputId="riasec-statut" [options]="statutsOptions" [(ngModel)]="leadStatut"
              name="leadStatut" optionLabel="label" placeholder="Sélectionnez votre statut"
              styleClass="lead-dropdown" aria-label="Statut"></p-dropdown>
          </div>

          <div class="form-group">
            <label for="riasec-annee">Année de naissance <span class="optionnel">(optionnel)</span></label>
            <p-dropdown inputId="riasec-annee" [options]="anneesOptions" [(ngModel)]="leadAnnee"
              name="leadAnnee" optionLabel="label" placeholder="Sélectionnez une année"
              styleClass="lead-dropdown" aria-label="Année de naissance"></p-dropdown>
          </div>

          <div class="form-group">
            <label for="riasec-email">Email <span class="optionnel">(optionnel)</span></label>
            <input id="riasec-email" type="email" class="form-control" [(ngModel)]="leadEmail" name="leadEmail"
              placeholder="votre@email.com" autocomplete="email" />
          </div>

          <button type="submit" class="btn-debloquer"
            [disabled]="leadChargement || !leadNom.trim() || !leadPrenom.trim() || !leadTelObj || telephoneInvalide()">
            <ng-container *ngIf="!leadChargement">
              <i class="bi bi-unlock-fill" aria-hidden="true"></i>
              Débloquer mon rapport complet
            </ng-container>
            <p-progressSpinner *ngIf="leadChargement" [style]="{'width':'22px','height':'22px'}"></p-progressSpinner>
          </button>

        </form>

        <p class="mention-confidentialite">
          <i class="bi bi-shield-check" aria-hidden="true"></i>
          Vos informations sont confidentielles et ne sont jamais revendues.
        </p>
      </div>

    </ng-container>

    <!-- ── APRÈS soumission lead : rapport complet débloqué ─────────────── -->
    <ng-container *ngIf="leadSoumis">

      <div *ngIf="leadErreur" role="alert" class="bloc-erreur mb-4">
        <i class="bi bi-exclamation-triangle-fill" aria-hidden="true"></i>
        <span>
          Vos coordonnées n'ont pas pu être enregistrées suite à un problème technique.
          Voici tout de même votre résultat complet.
        </span>
      </div>

      <div class="resultat-details mb-4">
        <div class="resultat-detail-item" *ngFor="let d of codeRiasecLettres">
          <h3>
            <span class="mini-badge" [ngClass]="'riasec-badge-' + d">{{ d }}</span>
            {{ dimensionsInfo[d].nom }}
          </h3>
          <p>{{ dimensionsInfo[d].descriptionLongue }}</p>
        </div>
      </div>

      <div *ngIf="metiersSuggeres.length > 0" class="metiers-suggeres mb-4">
        <h2 class="metiers-titre">Métiers qui pourraient vous correspondre</h2>
        <div class="metiers-grille">
          <a *ngFor="let m of metiersSuggeres" [routerLink]="['/info/metier', m.id_metier]" class="metier-carte">
            {{ m.titre }}
          </a>
        </div>
      </div>

      <div class="resultat-ctas">
        <a routerLink="/trouver-ma-formation" class="btn-riasec-cta">
          <i class="bi bi-compass-fill" aria-hidden="true"></i>
          Trouver ma formation
        </a>
        <button type="button" class="btn-outline-neutral-riasec" (click)="refaireLeTest()">
          <i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i>
          Refaire le test
        </button>
      </div>

    </ng-container>

  </div>
</section>
```

- [ ] **Step 3: Ajouter les styles du verrou, du formulaire et du rapport débloqué**

Ajouter à la fin de `cd2front/src/app/orientation/components/test/test.component.scss` :

```scss

/* ===== VERROU RÉSULTAT ===== */
.zone-verrouillee {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
}

.verrou-flou {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
}

.verrou-flou-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;
}

.verrou-masque {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.92) 70%);
}

.verrou-message {
  position: absolute;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  background: #1f2937;
  color: #fff;
  padding: 10px 18px;
  border-radius: 50px;
  font-size: 0.875rem;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ===== FORMULAIRE LEAD ===== */
.carte-lead-riasec {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  padding: 28px 24px;
  max-width: 480px;
  margin: 0 auto;
}

.lead-titre {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  margin-bottom: 8px;
}

.lead-description {
  color: #6b7280;
  text-align: center;
  margin-bottom: 20px;
}

.form-lead .form-group {
  margin-bottom: 16px;
}

.form-lead label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.requis { color: #dc2626; }
.optionnel { color: #9ca3af; font-weight: 400; }

.champ-erreur {
  display: block;
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 4px;
}

.btn-debloquer {
  width: 100%;
  background: linear-gradient(90deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 50px;
  padding: 12px;
  font-weight: 600;
  margin-top: 8px;

  &:disabled {
    opacity: 0.5;
  }
}

.mention-confidentialite {
  text-align: center;
  color: #9ca3af;
  font-size: 0.8rem;
  margin-top: 16px;
}

/* ===== RAPPORT DÉBLOQUÉ ===== */
.resultat-detail-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 12px;

  h3 {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.05rem;
    margin-bottom: 8px;
  }
}

.mini-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.metiers-titre {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.metiers-grille {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 12px;
}

.metier-carte {
  display: block;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px;
  text-align: center;
  color: #1f2937;
  font-weight: 600;
  text-decoration: none;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: #c4b5fd;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    color: #6d28d9;
    text-decoration: none;
  }
}

.resultat-ctas {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.btn-outline-neutral-riasec {
  background: #fff;
  border: 2px solid #e5e7eb;
  color: #374151;
  border-radius: 50px;
  padding: 10px 24px;
  font-weight: 600;

  &:hover {
    border-color: #c4b5fd;
    color: #6d28d9;
  }
}

.bloc-erreur {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  border-radius: 12px;
  padding: 14px 18px;
}
```

- [ ] **Step 4: Vérifier la compilation**

```bash
cd cd2front
npx ng build --configuration development
```

Expected : build sans erreur (en particulier, aucune erreur `strictTemplates` sur les nouveaux bindings `routerLink`, `p-dropdown`, `ngx-intl-tel-input`).

- [ ] **Step 5: Vérification manuelle bout-en-bout (nécessite le backend de la Task 2 démarré et la migration de la Task 1 appliquée)**

Terminal 1 :
```bash
cd ec_back
node server.js
```

Terminal 2 :
```bash
cd cd2front
npm start
```

Dans le navigateur, `http://localhost:4200/orientation/test` :
1. Faire le test (60 clics) jusqu'à l'écran résultat.
2. Vérifier que le radar et le profil dominant s'affichent (comme en Task 5), et qu'en dessous apparaît maintenant un bloc flouté ("Remplissez le formulaire pour débloquer...") + le formulaire de capture.
3. Laisser le formulaire vide → bouton "Débloquer mon rapport complet" désactivé.
4. Remplir Nom, Prénom, un numéro camerounais valide (ex: 6 70 00 00 00) → bouton activé. Soumettre.
5. Vérifier (DevTools → Network) que la requête `POST /api/riasec/submit` part avec le bon payload et reçoit un 201.
6. Vérifier que la vue bascule sur le rapport débloqué : description des 2-3 types dominants, grille de métiers suggérés cliquables (chaque carte doit naviguer vers `/info/metier/:id` sans erreur 404), CTA "Trouver ma formation" et "Refaire le test".
7. Couper le serveur backend (Ctrl+C sur le terminal 1), refaire le test et soumettre à nouveau le formulaire : vérifier que le bandeau d'erreur réseau apparaît MAIS que le rapport se débloque quand même (pas de blocage utilisateur).
8. Vérifier en base (backend arrêté donc relancer le serveur d'abord, puis) :
```bash
cd ec_back
node -e "
require('dotenv').config();
const con = require('./db');
con.query('SELECT id_client, nom_c, p_source FROM clients WHERE p_source = \'riasec_test\' ORDER BY id_client DESC LIMIT 3', (e, r) => {
  console.log(r);
  process.exit(0);
});
"
```
Expected : les leads de test créés à l'étape 4 apparaissent avec `p_source = 'riasec_test'`.

Arrêter les deux serveurs.

- [ ] **Step 6: Commit**

```bash
cd cd2front
git add src/app/orientation/components/test/test.component.ts src/app/orientation/components/test/test.component.html src/app/orientation/components/test/test.component.scss
git commit -m "$(cat <<'EOF'
feat(riasec): gate the full RIASEC report behind lead capture

Adds the teaser-then-lock pattern (mirroring orientation-v2): the
dominant profile + radar stay free, the detailed description and
real matching metier fiches unlock after submitting name/surname/
phone (+ optional statut/email/year) to POST /api/riasec/submit.
Network failure still unlocks the client-side result without a
false success message.
EOF
)"
```

---

## Notes de déploiement (rappel)

À exécuter manuellement en production, dans cet ordre (détail complet dans le spec) :

1. `git pull` sur `ec_back` (Tasks 1-2) et `cd2front` (Tasks 3-6).
2. `npm install` dans `cd2front` (nouvelle dépendance `chart.js`, Task 5).
3. Exécuter `ec_back/migrations/009_create_riasec.sql` sur la base de production (Task 1).
4. Redémarrer le serveur Node `ec_back`.
5. Rebuild/redéployer `cd2front`.

Aucune nouvelle variable d'environnement. Aucune modification d'une table, procédure ou route existante utilisée par un autre flux (`/orientation` classique et `orientation-v2` continuent de fonctionner à l'identique — seule `orientation-v2.component.ts` a un refactor interne sans changement de comportement, Task 3).
