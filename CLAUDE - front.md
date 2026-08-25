# CLAUDE.md — Camerdiplome Frontend
> Généré le 2026-04-21 · Mis à jour le 2026-06-11. Source de vérité pour l'AI Architect du projet.

---

## ⚡ DERNIÈRES MODIFICATIONS — Module Conseiller (2026-06-12)

| Fichier | Changement |
|---|---|
| `src/app/advisor/` | Nouveau module complet : formulaire de recherche rapide + table de résultats (voir architecture) |
| `src/app/advisor/advisor.service.ts` | Service complet : `loadRefData()` (categ/domaine/villes), `search(params)` (appelle `/api/result` + filtre budget client-side), `clearResults()` ; BehaviorSubjects `results$`, `error$`, `hasSearched$`, `categories$`, `domaines$`, `villes$` |
| `src/app/advisor/models/advisor-search-result.model.ts` | Interface `AdvisorSearchResult` (id_form, nom_e, sigle_e, logo_e, nom_dip, nom_cat, ville_cam, duree_f, cout_f, descriptif_f, conditions_f, descriptif_e, contacts) |
| `src/app/advisor/components/advisor-start/` | Composant central : header conseiller + panneau "Recherche rapide" (4 champs : Diplôme/Domaine/Ville/Budget) + `p-table` paginée 20/page sortable multi-colonnes avec expansion de ligne |
| `src/app/app.routes.ts` | Route `/advisor` (lazy) + `roleGuard(['ROLE_ADVISOR'])` |
| `src/app/login/login.component.ts` | Après login : redirect `/advisor/advisorStart` si `ROLE_ADVISOR` (avant le check ROLE_MODERATOR) |
| `src/app/admin/users-admin.service.ts` | Ajout section conseillers : `getAdvisorsFromServer()`, `createAdvisor()`, `deleteAdvisor()` via `API.ADMIN_ADVISORS` |
| `src/app/admin/models/advisor.model.ts` | Interface `Advisor { id, username, email, createdAt }` |
| `src/app/admin/components/list-advisors/` | Tableau admin des comptes conseillers + bouton créer/supprimer |
| `src/app/admin/components/new-advisor/` | Formulaire création compte conseiller (mot de passe généré par l'admin) |
| `src/app/shared/primeng.modules.ts` | Ajout `MessageModule` (pour `p-message severity="danger"`) |
| `src/app/constants/api-endpoints.ts` | `ADMIN_ADVISORS: \`${base}/api/admin/advisors\`` (déjà présent) |

---

## Historique — Module Modérateur (2026-06-11)

| Fichier | Changement |
|---|---|
| `src/app/app.routes.ts` | Route `/moderator` (lazy) + `roleGuard(['ROLE_MODERATOR'])` ; route `/admin` passe de `authGuard` à `roleGuard(['ROLE_ADMIN'])` |
| `src/app/login/login.component.ts` | Après login : redirect `/moderator/modStart` si `ROLE_MODERATOR`, sinon `/admin` |
| `src/app/header/header.component.ts` | Détecte `ROLE_MODERATOR` via `tokenStorageService`, expose `isModerator`, `username`, méthodes `signOut()` et `toModerator()` |
| `src/app/header/header.component.html` | Affiche `.moderator-bar` (badge nom + bouton Dashboard + bouton Déconnexion) si `isModerator` ; masque le CTA "Ajouter mon établissement" |
| `src/app/header/header.component.scss` | Thème `moderator-mode` : fond `#1a0f2e` (violet foncé) ; styles `.mod-badge`, `.mod-dashboard`, `.mod-logout` |
| `src/app/service/role.guard.ts` | Nouveau guard paramétrable `roleGuard(allowedRoles[])` remplaçant `authGuard` |
| `src/app/moderator/` | Nouveau module complet (voir architecture) |
| `src/app/admin/users-admin.service.ts` | Nouveau service pour la gestion des modérateurs |
| `src/app/admin/models/moderator.model.ts` | Interface `Moderator { id, username, email, createdAt }` |
| `src/app/admin/components/list-moderators/` | Tableau PrimeNG liste des modérateurs + bouton créer/supprimer |
| `src/app/admin/components/new-moderator/` | Formulaire création modérateur avec génération de mot de passe aléatoire |
| `src/app/constants/api-endpoints.ts` | Ajout `ADMIN_USERS: \`${base}/api/admin/users\`` |

---

## 1. STACK TECHNIQUE

| Technologie | Version | Rôle | Notes importantes |
|---|---|---|---|
| Angular | 17.3.x | Framework SPA principal | Mode standalone + modules hybride |
| TypeScript | ~5.4.2 | Langage principal | strictTemplates, noImplicitReturns activés |
| @angular/ssr | ^17.3.5 | Server-Side Rendering | Prerendering activé, hydration côté client |
| @nguniversal/express-engine | ^7.1.1 | SSR Express server | Entry: `server.ts` |
| RxJS | ~7.8.0 | Réactivité & state | BehaviorSubjects pour le state, pas NgRx |
| PrimNG | ^17.18.2 | Librairie UI principale | Thème : lara-light-blue |
| Bootstrap | ^4.5.0 | Grid & utilitaires CSS | Bootstrap 4, pas 5 |
| @angular/material | ^17.3.10 | Thème pink-bluegrey | Utilisé surtout pour les styles |
| ngx-bootstrap | ^12.0.0 | Composants Bootstrap pour Angular | — |
| Quill | ^2.0.2 | Éditeur rich text | Pour articles/descriptions |
| ngx-intl-tel-input | ^3.2.0 | Saisie téléphone international | Module orientation |
| google-libphonenumber | ^3.2.38 | Validation numéros tel | Dépendance intl-tel-input |
| jQuery | ^3.7.1 | Interactivité DOM legacy | Chargé globalement via angular.json |
| sitemap | ^8.0.0 | Génération sitemap | Côté serveur/SSR |
| Karma + Jasmine | ~6.4 / ~5.1 | Tests unitaires | Peu de tests écrits |

---

## 2. ARCHITECTURE GÉNÉRALE

```
cd2front/
├── src/
│   ├── app/
│   │   ├── [feature modules - lazy loaded]
│   │   │   ├── admin/              ← CRUD backoffice + gestion modérateurs/conseillers
│   │   │   ├── advisor/            ← Espace conseiller (recherche rapide formations)
│   │   │   ├── moderator/          ← Backoffice modérateur (avis, articles, lecture données)
│   │   │   ├── actualite/          ← Blog/Actualités
│   │   │   ├── informations/       ← Pages info diplômes/filières/écoles
│   │   │   ├── orientation/        ← Tunnel orientation multi-étapes
│   │   │   └── student-avis/       ← Avis étudiants sur les écoles
│   │   ├── [standalone components - chargés eagerly]
│   │   │   ├── landing-page/       ← Page d'accueil
│   │   │   ├── login/ register/    ← Authentification
│   │   │   ├── header/ footer/     ← Layout
│   │   │   ├── spiner/             ← Spinner global
│   │   │   ├── about/ faq/ legal/  ← Pages statiques
│   │   │   ├── condition/ politique/
│   │   │   ├── orientation-v2/     ← Tunnel orientation simplifié (3 phases, standalone, OnPush)
│   │   │   ├── top-news-slide/     ← Carrousel actualités (WIP, non routé)
│   │   │   ├── top-video-slide/    ← Carrousel vidéos (WIP, non routé)
│   │   │   ├── headmsg/            ← Composant message header (WIP, non routé)
│   │   │   ├── home/               ← Composant page home alternatif (WIP, non routé)
│   │   │   └── start/              ← Composant start (WIP, non routé)
│   │   ├── service/                ← Services core (auth, user, token, spinner, seo)
│   │   ├── interceptors/           ← AuthInterceptor (actif), LoadingInterceptor
│   │   ├── model/                  ← Interfaces/classes métier partagées
│   │   ├── shared/                 ← SharedModule (pipes, composants réutilisables)
│   │   ├── app.routes.ts           ← Routing racine
│   │   ├── app.config.ts           ← Configuration app standalone
│   │   └── app.module.ts           ← NgModule minimal (legacy, importe PrimNG)
│   ├── environments/
│   │   ├── environment.ts          ← Dev : apiUrl = http://localhost:3000
│   │   └── environment.prod.ts     ← Prod : apiUrl = https://nodeapp.camerdiplome.com
│   ├── styles.scss                 ← Styles globaux + imports CSS librairies
│   ├── index.html                  ← Google Analytics (G-Q377ERR21S) intégré
│   └── assets/                     ← Images, robots.txt, sitemap.xml
├── server.ts                       ← Serveur Express pour SSR
├── angular.json                    ← Config build, budgets 5MB/10MB
├── tsconfig.json                   ← strict + strictTemplates
└── package.json
```

**Logique d'organisation** : Architecture feature-module Angular classique. Chaque fonctionnalité majeure est un module lazy-loadé indépendant. Les composants de page racine (landing, login, pages statiques) sont standalone et chargés eagerly. Le `SharedModule` centralise les pipes et composants réutilisables.

---

## 3. ROUTING & PAGES

| Route | Fichier | Type | Rendu | Description |
|---|---|---|---|---|
| `/` | `landing-page/landing-page.component.ts` | Public | SSR | Page d'accueil : actualités, compteurs formations, pub écoles |
| `/login` | `login/login.component.ts` | Public | CSR | Formulaire login JWT |
| `/register` | `register/register.component.ts` | Public | CSR | Inscription (redirige vers WhatsApp) |
| `/about` | `about/about.component.ts` | Public | CSR | Page "À propos" |
| `/faq` | `faq/faq.component.ts` | Public | CSR | Questions fréquentes |
| `/politique` | `politique/politique.component.ts` | Public | CSR | Politique de confidentialité |
| `/condition` | `condition/condition.component.ts` | Public | CSR | Conditions générales |
| `/legal` | `legal/legal.component.ts` | Public | CSR | Mentions légales |
| `/building` | `en-construction/en-construction.component.ts` | Public | CSR | Page placeholder |
| `/comment` | `vomments/vomments.component.ts` | Public | CSR | Affichage commentaires |
| `/view` | `usertest/usertest.component.ts` | Public | CSR | Composant de test |
| `/info` | `informations/informations.module.ts` | Public | SSR | Module infos diplômes (lazy) |
| `/info/diplome` | `informations/components/info-diplome/` | Public | SSR | Vue d'ensemble des diplômes |
| `/info/system` | `informations/components/info-system/` | Public | SSR | Système éducatif camerounais |
| `/info/cap` | `informations/components/info-cap/` | Public | SSR | Infos diplôme CAP |
| `/info/bts` | `informations/components/info-bts/` | Public | SSR | Infos diplôme BTS |
| `/info/hnd` | `informations/components/info-hnd/` | Public | SSR | Infos diplôme HND |
| `/info/dut` | `informations/components/info-dut/` | Public | SSR | Infos diplôme DUT |
| `/info/bac-technique` | `informations/components/info-bac-technique/` | Public | SSR | Infos Bac Technique |
| `/info/bachelor` | `informations/components/info-bachelor/` | Public | SSR | Infos Bachelor |
| `/info/licence` | `informations/components/info-licence/` | Public | SSR | Infos Licence |
| `/info/licence-pro` | `informations/components/info-licence-pro/` | Public | SSR | Infos Licence Pro |
| `/info/master` | `informations/components/info-master/` | Public | SSR | Infos Master |
| `/info/capacite` | `informations/components/info-capacite/` | Public | SSR | Infos Capacité en Droit |
| `/info/cqp` | `informations/components/info-cqp/` | Public | SSR | Infos CQP/DQP |
| `/info/prepa` | `informations/components/info-prepa/` | Public | SSR | Infos Classes Prépas |
| `/info/ecole` | `informations/components/info-ecole/` | Public | SSR | Liste des écoles |
| `/info/metier` | `informations/components/info-metier/` | Public | SSR | Liste des métiers |
| `/info/domaine/:slug/:id` | `informations/components/info-domaine-item/` | Public | SSR | Détail d'un domaine |
| `/info/ecole/:slug/:id` | `informations/components/info-ecole-item/` | Public | SSR | Fiche détail école |
| `/info/formation/:id` | `informations/components/info-formation-item/` | Public | SSR | Fiche détail formation |
| `/orientation` | `orientation/orientation.module.ts` | Public | CSR | Tunnel orientation (lazy) |
| `/orientation/degree` | `orientation/components/degree/` | Public | CSR | Étape 1 : choix niveau diplôme |
| `/orientation/test` | `orientation/components/test/` | Public | CSR | Composant de test orientation |
| `/orientation/city` | `orientation/components/city/` | Public | CSR | Étape 2 : choix ville |
| `/orientation/field` | `orientation/components/field/` | Public | CSR | Étape 3 : choix domaine |
| `/orientation/statuts` | `orientation/components/statuts/` | Public | CSR | Étape 4 : statut étudiant |
| `/orientation/classe` | `orientation/components/classe/` | Public | CSR | Étape 5 : niveau classe |
| `/orientation/etudiant` | `orientation/components/etudiant/` | Public | CSR | Étape 6 : type étudiant |
| `/orientation/dernierDiplome` | `orientation/components/dernierdiplome/` | Public | CSR | Étape 7 : dernier diplôme |
| `/orientation/contact` | `orientation/components/contact/` | Public | CSR | Étape 8 : contact (nom, tel, email) |
| `/orientation/resultats` | `orientation/components/resultats/` | Public | CSR | Résultats de recherche |
| `/advisor` | `advisor/advisor.module.ts` | **Protégé (`roleGuard(['ROLE_ADVISOR'])`)** | CSR | Espace conseiller (lazy) |
| `/advisor/advisorStart` | `advisor/components/advisor-start/` | Conseiller | CSR | Recherche rapide de formations (formulaire + table résultats) |
| `/admin` | `admin/admin.module.ts` | **Protégé (`roleGuard(['ROLE_ADMIN'])`)** | CSR | Backoffice admin (lazy) |
| `/admin` (default) | `admin/components/admin-start/` | Admin | CSR | Dashboard admin |
| `/admin/new-campus` | `admin/components/new-campus/` | Admin | CSR | Créer un campus |
| `/admin/new-ecole` | `admin/components/new-ecole/` | Admin | CSR | Créer une école |
| `/admin/new-diplome` | `admin/components/new-diplome/` | Admin | CSR | Créer un diplôme |
| `/admin/new-formation` | `admin/components/new-formation/` | Admin | CSR | Créer une formation |
| `/admin/new-universite` | `admin/components/new-univ/` | Admin | CSR | Créer une université |
| `/admin/new-article` | `admin/components/new-article/` | Admin | CSR | Créer un article |
| `/admin/moderateurs` | `admin/components/list-moderators/` | Admin | CSR | Liste des comptes modérateurs |
| `/admin/new-moderateur` | `admin/components/new-moderator/` | Admin | CSR | Créer un compte modérateur (mot de passe généré par l'admin) |
| `/admin/advisors` | `admin/components/list-advisors/` | Admin | CSR | Liste des comptes conseillers |
| `/admin/new-advisor` | `admin/components/new-advisor/` | Admin | CSR | Créer un compte conseiller (mot de passe généré par l'admin) |
| `/admin/:id` | `admin/components/single-*/` | Admin | CSR | Détail d'une ressource |
| `/admin/modif-*/:id` | `admin/components/modif-*/` | Admin | CSR | Modification d'une ressource |
| `/moderator` | `moderator/moderator.module.ts` | **Protégé (`roleGuard(['ROLE_MODERATOR'])`)** | CSR | Backoffice modérateur (lazy) |
| `/moderator/modStart` | `moderator/components/moderator-start/` | Modérateur | CSR | Dashboard modérateur — 3 onglets : Avis, Articles, Données |
| `/moderator/new-article` | `moderator/components/new-article-mod/` | Modérateur | CSR | Créer un article |
| `/moderator/article/:id` | `moderator/components/single-article-mod/` | Modérateur | CSR | Détail d'un article |
| `/moderator/modif-article/:id` | `moderator/components/modif-article-mod/` | Modérateur | CSR | Modifier un article |
| `/actualite` | `actualite/actualite.module.ts` | Public | SSR | Module news (lazy) |
| `/actualite/actues` | `actualite/components/actu/` | Public | SSR | Liste des actualités |
| `/actualite/blog/:subject` | `actualite/components/single-actu/` | Public | SSR | Article de blog par sujet |
| `/avis` | `student-avis/student-avis.module.ts` | Public | CSR | Module avis (lazy) |
| `/avis` (default) | `student-avis/components/avis-start/` | Public | CSR | Page de départ avis |
| `/avis/avisSchool/:id` | `student-avis/components/avis-school/` | Public | CSR | Avis pour une école |
| `/avis/monAvis/:id` | `student-avis/components/mon-avis/` | Public | CSR | Formulaire avis étudiant |
| `/avis/merci` | `student-avis/components/merci/` | Public | CSR | Page confirmation avis |
| `/trouver-ma-formation` | `orientation-v2/orientation-v2.component.ts` | Public | CSR | Tunnel orientation v2 simplifié (3 phases) |
| `**` | — | — | — | Redirect vers `/` |

---

## 4. COMPOSANTS CLÉS

### AppComponent
- **Chemin** : `src/app/app.component.ts`
- **Rôle** : Composant racine, layout global (header + router-outlet + footer + spinner)
- **Props/État** : `isLoggedIn`, `showAdminBoard`, `roles[]`, `profileForm`
- **Notable** : Écoute `NavigationEnd` pour nettoyage modal Bootstrap ; vérifie session au démarrage

### HeaderComponent
- **Chemin** : `src/app/header/header.component.ts`
- **Rôle** : Barre de navigation principale avec toggle mobile
- **Standalone** : Oui
- **Moderator mode** : Au `ngOnInit`, lit `tokenStorageService.getUser()` — si le rôle `ROLE_MODERATOR` est présent, active `isModerator = true` et expose `username`. Le template applique la classe CSS `.moderator-mode` (fond violet `#1a0f2e`) et affiche `.moderator-bar` : badge nom, bouton Dashboard (`toModerator()` → `/moderator`), bouton Déconnexion (`signOut()`). Le CTA "Ajouter mon établissement" est masqué quand `isModerator` est vrai.
- **Dépendances injectées** : `tokenStorageService` (inject), `Router` (inject)

### LandingPageComponent
- **Chemin** : `src/app/landing-page/landing-page.component.ts`
- **Rôle** : Page d'accueil principale — agrège les blocs news, compteurs, pubs
- **Dépendances** : `ActuListComponent`, `SchoolAdversComponent`, `TopNewsService`, `AdversService`
- **Image héros** : `./assets/images/home.webp`

### SpinerComponent
- **Chemin** : `src/app/spiner/spiner.component.ts`
- **Rôle** : Overlay spinner global, affiché pendant toute requête HTTP
- **Dépendance** : `SpinerService.loading$` (Observable<boolean>)

### InfoEcoleItemComponent
- **Chemin** : `src/app/informations/components/info-ecole-item/`
- **Rôle** : Fiche complète d'une école (infos, formations, campus, avis)
- **Route param** : `slug` + `id`
- **Notable** : Composant le plus riche du module informations

### ResultatsComponent
- **Chemin** : `src/app/orientation/components/resultats/`
- **Rôle** : Affiche les formations correspondant aux critères du tunnel orientation
- **Dépendance** : `OrientationService.getSerchResult()`

### AdminStartComponent
- **Chemin** : `src/app/admin/components/admin-start/`
- **Rôle** : Dashboard d'entrée admin, liste les entités et accès rapides CRUD
- **Notable** : Bouton "Modérateurs" (conditionnel `showAdminBoard`) → onglet `ListModeratorsComponent`. Bouton "Déconnexion" (`signOut()` → `/login`). `Router` injecté via `inject(Router)` (champ de classe) — PAS en paramètre de constructeur (incompatibilité Vite + Angular 17 `emitDecoratorMetadata`).

### AdvisorStartComponent
- **Chemin** : `src/app/advisor/components/advisor-start/`
- **Rôle** : Composant central de l'espace conseiller — affiche en une seule page : header (badge + username + Déconnexion), formulaire de recherche rapide et table de résultats inline
- **Formulaire** : 4 champs optionnels — `p-dropdown` Diplôme (`/api/categ` → `nom_cat`), Domaine (`/api/domaine` → `nom_dom`), Ville (`/api/cyties` → `ville_cam`), input natif Budget max (FCFA). Bouton "Rechercher" désactivé tant que tous les champs sont vides ou pendant loading.
- **Table résultats** : `p-table` PrimeNG, paginée 20/page, tri multiple (`sortMode="multiple"`), lignes expandables avec `dataKey="id_form"`. Colonnes : École (logo/initiales + sigle), Diplôme, Filière, Ville (tag bleu), Durée, Coût (FCFA), Contacts (icônes cliquables tel/mail/web). Ligne expandée : descriptif_f, conditions_f, descriptif_e, contacts détaillés.
- **États** : invite initiale / spinner loading / `p-message severity="danger"` erreur / "Aucune formation trouvée" / résultats
- **Dépendances injectées** : `tokenStorageService`, `AdvisorService`, `PLATFORM_ID`
- **Reactive forms** : `FormGroup` avec `FormControl<string|null>` pour les dropdowns, `FormControl<number|null>` pour le budget
- **Notable** : budget filtré **côté client** (le backend `/api/result` ne supporte pas de param `budget`)

### ModeratorStartComponent
- **Chemin** : `src/app/moderator/components/moderator-start/`
- **Rôle** : Dashboard modérateur — affiche le nom d'utilisateur connecté, 3 onglets : Avis (défaut), Articles, Données
- **Sous-composants** : `ModerationAvisComponent`, `ListArticleModComponent`, `ViewDataModComponent`

### ModerationAvisComponent
- **Chemin** : `src/app/moderator/components/moderation-avis/`
- **Rôle** : Table paginée des avis étudiants (20/page, triable). Toggle visibilité (badge vert/rouge) + suppression. Lignes masquées à `opacity: 0.5`.

### ListArticleModComponent
- **Chemin** : `src/app/moderator/components/list-article-mod/`
- **Rôle** : Table des articles avec badges Publié/Brouillon. Sélection d'une ligne → `moderator/article/:id`. Bouton "Nouvel article".

### ViewDataModComponent
- **Chemin** : `src/app/moderator/components/view-data-mod/`
- **Rôle** : Lecture seule des données de référence (sous-onglets : Formations, Écoles, Universités). Aucune action de modification.

### ListModeratorsComponent
- **Chemin** : `src/app/admin/components/list-moderators/`
- **Rôle** : Tableau admin des comptes modérateurs. Colonnes : ID, username, email, createdAt, bouton supprimer.

### NewModeratorComponent
- **Chemin** : `src/app/admin/components/new-moderator/`
- **Rôle** : Formulaire création d'un compte modérateur. Le mot de passe est généré automatiquement (12 chars, charset sans ambiguïté) — champ `readonly` + bouton copier. L'admin transmet le mot de passe manuellement au modérateur.

### ListAdvisorsComponent
- **Chemin** : `src/app/admin/components/list-advisors/`
- **Rôle** : Tableau admin des comptes conseillers. Colonnes : ID, username, email, createdAt, bouton supprimer. Bouton "Nouveau conseiller" → `admin/new-advisor`. Dépendance : `UsersAdminService.advisors$`.

### NewAdvisorComponent
- **Chemin** : `src/app/admin/components/new-advisor/`
- **Rôle** : Formulaire création d'un compte conseiller. Même pattern que `NewModeratorComponent` (mot de passe généré, champ readonly, bouton copier). L'admin transmet les credentials manuellement au conseiller.

### NewEcoleComponent / ModifEcoleComponent
- **Chemin** : `src/app/admin/components/new-ecole/` et `modif-ecole/`
- **Rôle** : Formulaires réactifs création/modification d'école
- **Dépendance** : `AdminService`, `PrimNG FileUpload`, `PrimNG Editor (Quill)`

### PubInterestItemComponent
- **Chemin** : `src/app/shared/components/pub-interest-item/`
- **Rôle** : Carte de formation sponsorisée affichée sur les pages d'info
- **Input** : objet `interestelt`

### AvisSchoolComponent
- **Chemin** : `src/app/student-avis/components/avis-school/`
- **Rôle** : Page principale des avis pour une école — affiche notes moyennes et liste d'avis
- **Route param** : `id` (id école)

### OrientationV2Component
- **Chemin** : `src/app/orientation-v2/orientation-v2.component.ts`
- **Rôle** : Tunnel orientation simplifié en 3 phases linéaires (A: ville → B: domaine → C: résultats)
- **Route** : `/trouver-ma-formation` (standalone, `ChangeDetectionStrategy.OnPush`)
- **Lead capture** : Affiche 3 résultats librement, le reste est verrouillé derrière un formulaire (prénom + téléphone + email). POST vers `/api/result` avant de débloquer.
- **Filtre diplôme** : PrimNG Dropdown côté client sur les résultats, bloqué tant que le lead n'est pas soumis
- **APIs** : `GET /api/cyties`, `GET /api/field/page`, `GET /api/result` (+ POST lead)
- **Notable** : `ChangeDetectionStrategy.OnPush` — toujours appeler `cdr.markForCheck()` après un changement d'état

---

## 5. STATE MANAGEMENT

**Outil** : **RxJS BehaviorSubjects dans les services** — pas de NgRx, pas de Signals Angular 17.

### Flux de données global

```
Service (BehaviorSubject) → Observable$ → Component (async pipe / subscribe)
                                ↑
                           HTTP call + tap(data => subject.next(data))
```

### Stores par service

| Service | BehaviorSubjects | Responsabilité |
|---|---|---|
| `AdminService` | `_formation$`, `_universite$`, `_ecole$`, `_diplome$`, `_campus$`, `_categ$`, `_domaine$`, `_article$`, `_avis$`, `_loading$` | Cache et CRUD de toutes les entités admin |
| `UsersAdminService` | `_moderators$`, `_loadingMod$`, `_advisors$`, `_loadingAdv$` | CRUD des comptes modérateurs (`/api/admin/users`) ET conseillers (`/api/admin/advisors`) |
| `AdvisorService` | `_results$`, `_error$`, `_hasSearched$`, `_categories$`, `_domaines$`, `_villes$`, `_loading$` | Recherche de formations (module conseiller) : données de référence + résultats de recherche |
| `ModeratorService` | `_articles$`, `_avis$`, `_formations$`, `_ecoles$`, `_universites$`, `_loading$` | Données du module modérateur (articles CRUD, avis modération, données lecture seule) |
| `OrientationService` | `_cyties$`, `_school$`, `_domaine$`, `_degree$`, `_loading$` | Données du tunnel + profil utilisateur (`initialUser`) |
| `AvisService` | `_ecoleAvis$` | Cache liste écoles avec leurs notes |
| `SpinerService` | `loadingSubject` | État global du spinner HTTP |
| `TopNewsService` | `_loading$` | État loading top news |

**Caching** : `AdminService` et `OrientationService` utilisent un `lastCandidatesLoad` (timestamp) pour éviter les requêtes dupliquées. Pas d'invalidation de cache implémentée.

---

## 6. SERVICES & API

**Base URL** : `environment.apiUrl` → dev: `http://localhost:3000` | prod: `https://nodeapp.camerdiplome.com`  
**Préfixe** : `/api/` sur tous les endpoints.

### AuthService (`src/app/service/auth.service.ts`)

| Méthode | HTTP | Endpoint | Payload | Retour |
|---|---|---|---|---|
| `login()` | POST | `/api/auth/signin` | `{ username, password }` | `{ accessToken, roles[], ... }` |
| `register()` | POST | `/api/auth/signup` | `{ username, email, password }` | Confirmation |

### UserService (`src/app/service/user.service.ts`)

| Méthode | HTTP | Endpoint | Payload | Retour |
|---|---|---|---|---|
| `getPublicContent()` | GET | `/api/test/all` | — | string |
| `getUserBoard()` | GET | `/api/test/user` | — | string |
| `getModeratorBoard()` | GET | `/api/test/mod` | — | string |
| `getAdminBoard()` | GET | `/api/test/admin` | — | string |
| `postEts()` | POST | `/api/ets` | `EtsForm { nom, prenom, etablissement, ville, comment, email, phone }` | `EtsForm` |

### AdminService (`src/app/admin/admin.service.ts`)

| Méthode | HTTP | Endpoint | Payload | Retour |
|---|---|---|---|---|
| `getFormationsFromServer()` | GET | `/api/formations` | — | `Formation[]` |
| `addNewFormation()` | POST | `/api/formations` | `Formation` | `Formation` |
| `editFormation()` | PUT | `/api/formations` | `Formation` | `Formation` |
| `deletFormationById(id)` | DELETE | `/api/formations?idForm={id}` | — | — |
| `getUniversiteFromServer()` | GET | `/api/universites` | — | `Universite[]` |
| `addNewUniv()` | POST | `/api/universites` | `Universite` | `Universite` |
| `editUniv()` | PUT | `/api/universites` | `Universite` | `Universite` |
| `deletUnivById(id)` | DELETE | `/api/universites?idUniv={id}` | — | — |
| `getEcoleFromServer()` | GET | `/api/ecoles` | — | `Ecole[]` |
| `addNewEcole()` | POST | `/api/ecoles` | `Ecole` | `Ecole` |
| `editEcole()` | PUT | `/api/ecoles` | `Ecole` | `Ecole` |
| `deletEcoleById(id)` | DELETE | `/api/ecoles?idEcole={id}` | — | — |
| `getDiplomeFromServer()` | GET | `/api/diplomes` | — | `Diplome[]` |
| `addNewDiplome()` | POST | `/api/diplomes` | `Diplome` | `Diplome` |
| `editDiplome()` | PUT | `/api/diplomes` | `Diplome` | `Diplome` |
| `deletDiplomeById(id)` | DELETE | `/api/diplomes?idDiplome={id}` | — | — |
| `getCampusFromServer()` | GET | `/api/campus` | — | `Campus[]` |
| `addNewCampus()` | POST | `/api/campus` | `Campus` (incl. `tel_camp`) | `Campus` |
| `editCamp()` | PUT | `/api/campus` | `Campus` | `Campus` |
| `deletCampusById(id)` | DELETE | `/api/campus?idCamp={id}` | — | — |
| `getArticleFromServer()` | GET | `/api/actualite` | — | `Article[]` |
| `addNewArticle()` | POST | `/api/actualite` | `Article` | `Article` |
| `editArticle()` | PUT | `/api/actualite` | `Article` | `Article` |
| `deletArticleById(id)` | DELETE | `/api/actualite?idArti={id}` | — | — |
| `getAvisFromServer()` | GET | `/api/avis` | — | `Avis[]` |
| `getDomaineFromServer()` | GET | `/api/domaine` | — | `Domaine[]` |
| `getCategFromServer()` | GET | `/api/categ` | — | `Categ[]` |

### OrientationService (`src/app/orientation/orientation.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `getAllCyties()` | GET | `/api/cyties` | `ville[]` |
| `getPartCyties(degree, domaine, branche)` | GET | `/api/partCyties?Degree={}&Domaine={}` | `ville[]` |
| `getDomaineFromServer(degree)` | GET | `/api/field?DomaineDegree={degree}` | `field[]` |
| `getPartDomaine(degree, city)` | GET | `/api/field?DomaineDegree={}&DomaineCyti={}` | `field[]` |
| `getDegreeCyti(city)` | GET | `/api/degree?DegreeCyti={city}` | `degree[]` |
| `getDegreeField(field)` | GET | `/api/degree?DegreeField={field}` | `degree[]` |
| `saveContact() / saveClient()` | POST | `/api/result` | `UserProfil` |
| `getSerchResult()` | GET | `/api/result?city={}&diplome={}&domaine={}&branche={}` | `interestelt[]` |

### AvisService (`src/app/student-avis/avis.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `getEcoleAvisFromServer()` | GET | `/api/ecoleavis` | `EcoleAvis[]` |
| `getEcoleAvisById(schoolId)` | GET | `/api/ecoleavis/notes?idSchool={id}` | `EcoleAvis[]` |
| `getAvisForSchoolId(schoolId)` | GET | `/api/ecoleavis/school?idSchool={id}` | `Avis[]` |
| `sendAvis(userAvis)` | POST | `/api/avis` | `Avis` |
| `getCampusForSchool(id)` | GET | `/api/ecoleavis/campus?idSchool={id}` | `CampusSchool[]` |
| `getCursusForSchool(id)` | GET | `/api/ecoleavis/cursus?idSchool={id}` | `Cursus[]` |
| `getOneCursus(idDip)` | GET | `/api/ecoleavis/diplo?idDip={id}` | `Cursus[]` |

### UsersAdminService (`src/app/admin/users-admin.service.ts`)

| Méthode | HTTP | Endpoint | Payload | Retour |
|---|---|---|---|---|
| `getModeratorsFromServer()` | GET | `API.ADMIN_USERS` | — | `Moderator[]` |
| `createModerator(form)` | POST | `API.ADMIN_USERS` | `{ username, email, password }` | Confirmation |
| `deleteModerator(id)` | DELETE | `API.ADMIN_USERS/${id}` | — | — |
| `getAdvisorsFromServer()` | GET | `API.ADMIN_ADVISORS` | — | `Advisor[]` |
| `createAdvisor(form)` | POST | `API.ADMIN_ADVISORS` | `{ username, email, password }` | Confirmation |
| `deleteAdvisor(id)` | DELETE | `API.ADMIN_ADVISORS/${id}` | — | — |

### AdvisorService (`src/app/advisor/advisor.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `loadRefData()` | GET x3 | `/api/categ`, `/api/domaine`, `/api/cyties` | Remplit `categories$`, `domaines$`, `villes$` (une seule fois au chargement) |
| `search(params)` | GET | `/api/result?diplome=&domaine=&city=` | `AdvisorSearchResult[]` (filtre budget côté client si param `budget` présent) |
| `clearResults()` | — | — | Remet `results$`, `error$`, `hasSearched$` à leur état initial |

**BehaviorSubjects exposés** : `loading$`, `results$` (`AdvisorSearchResult[]`), `error$` (`string|null`), `hasSearched$` (`boolean`), `categories$` (`Categ[]`), `domaines$` (`Domaine[]`), `villes$` (`ville[]`).

### ModeratorService (`src/app/moderator/moderator.service.ts`)

| Méthode | HTTP | Endpoint | Payload | Retour |
|---|---|---|---|---|
| `getArticlesFromServer()` | GET | `API.ACTUALITE.BASE` | — | `Article[]` |
| `getArticleById(id)` | — | BehaviorSubject | — | `Article \| undefined` |
| `addNewArticle(form)` | POST | `API.ACTUALITE.BASE` | `Article` | — |
| `editArticle(form)` | PUT | `API.ACTUALITE.BASE` | `Article` | — |
| `deleteArticle(id)` | DELETE | `API.ACTUALITE.BASE?idArti=` | — | — |
| `getAvisFromServer()` | GET | `API.AVIS` | — | `Avis[]` |
| `toggleAvisVisibility(id, visible)` | PUT | `API.AVIS` | `{ id_avis, visible }` | — |
| `deleteAvis(id)` | DELETE | `API.AVIS?idAvis=` | — | — |
| `getFormationsFromServer()` | GET | `API.FORMATIONS` | — | `Formation[]` |
| `getEcolesFromServer()` | GET | `API.ECOLES` | — | `Ecole[]` |
| `getUniversitesFromServer()` | GET | `API.UNIVERSITES` | — | `Universite[]` |

### ActuService (`src/app/actualite/actu.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `getAllActu()` | GET | `/api/actualite` | `Actualite[]` |
| `getSomeActu()` | GET | `/api/actualite/some` | `Actualite[]` |
| `getActualiteBySubject(subject)` | GET | `/api/actualite/blog?subjectActu={subject}` | `Actualite[]` |

### AdversService (`src/app/service/advers.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `getFormationPub()` | GET | `/api/advers/formation` | `FormationAdvers[]` |
| `getFormationPubForShool(id)` | GET | `/api/advers/formationSchool?idSchool={id}` | `FormationAdvers[]` |
| `getFormationPubByDom(id)` | GET | `/api/advers/domaine?idDom={id}` | `FormationAdvers[]` |
| `getSchoolPub()` | GET | `/api/advers/school` | `SchoolAdvers[]` |

### TopNewsService (`src/app/service/top-news.service.ts`)

| Méthode | HTTP | Endpoint | Retour |
|---|---|---|---|
| `getAllTopNews()` | GET | `/api/topNewsSlide` | `TopNews[]` |
| `countFormation()` | GET | `/api/countFomration` | `counter[]` |

### SeoService (`src/app/service/seo.service.ts`)

Service centralisé pour tous les tags SEO. Fournit `providedIn: 'root'`.

| Méthode | Description |
|---|---|
| `setSeo(config: SeoConfig)` | Pose `<title>`, `description`, `keywords`, Open Graph complet, Twitter Card et `<link rel="canonical">` |
| `setSchemaJsonLd(schema, key)` | Injecte un script `application/ld+json` dans le `<head>` (remplace s'il existe déjà) |
| `setBreadcrumb(items)` | Injecte un `BreadcrumbList` Schema.org |
| `setJsonLd(items)` | Alias déprécié vers `setBreadcrumb()` |

**Interface** :
```typescript
interface SeoConfig {
  title: string;       // requis
  description: string; // requis, tronqué à 160 chars
  url: string;         // requis, relatif (ex: '/info/ecole/...')
  image?: string;      // défaut: https://www.camerdiplome.com/assets/images/home.webp
  type?: string;       // défaut: 'website'
  keywords?: string;
}
```

**Composants qui l'utilisent** : `LandingPageComponent`, `AboutComponent`, `FaqComponent`, `LegalComponent`, `PolitiqueComponent`, `ConditionComponent`, `InfoEcoleComponent`, `InfoEcoleItemComponent`, `InfoDomaineItemComponent`, `InfoFormationItemComponent`, `InfoMetierComponent`, `InfoMetierItemComponent`, `SingleActuComponent`.

---

## 7. AUTHENTIFICATION

### Flux complet étape par étape

```
1. Utilisateur soumet le formulaire LoginComponent
       ↓
2. AuthService.login({ username, password })
       POST /api/auth/signin
       ↓
3. Réponse serveur : { accessToken: "JWT...", roles: ["ROLE_ADMIN"], username, ... }
       ↓
4. tokenStorageService.saveToken(data.accessToken)
       → sessionStorage["x-access-token"] = JWT
   tokenStorageService.saveUser(data)
       → sessionStorage["auth_user"] = JSON.stringify(data)
       ↓
5. Redirection selon le rôle (ordre de priorité) :
   - roles.includes('ROLE_ADVISOR')   → router.navigate(['/advisor/advisorStart'])
   - roles.includes('ROLE_MODERATOR') → router.navigate(['/moderator/modStart'])
   - sinon → router.navigate(['/admin'])
       ↓
6. AppComponent lit sessionStorage pour initialiser isLoggedIn et roles
```

### Persistance de session

| Clé | Stockage | Contenu |
|---|---|---|
| `x-access-token` | sessionStorage | JWT Bearer token |
| `auth_user` | sessionStorage | Objet utilisateur JSON complet (username, email, roles[]) |

**Important** : sessionStorage est effacé à la fermeture de l'onglet. Pas de "remember me".

### Gestion des rôles

Les rôles sont lus depuis `sessionStorage["auth_user"].roles[]` au chargement de `AppComponent`.  
Valeurs attendues : `"ROLE_ADMIN"`, `"ROLE_MODERATOR"`, `"ROLE_ADVISOR"`, `"ROLE_USER"`.  
Flags utilisés dans l'UI : `showAdminBoard`, `showModeratorBoard`.

### Sécurité — POINTS CRITIQUES

> **Routes admin, modérateur ET conseiller PROTÉGÉES**
> - `AuthInterceptor` **enregistré** dans `app.config.ts` via `withInterceptorsFromDi()` — le token JWT est envoyé automatiquement dans tous les headers HTTP.
> - `roleGuard(allowedRoles[])` (fonctionnel `CanActivateFn` paramétrable) appliqué sur `/admin`, `/moderator` et `/advisor`. Fichier : `src/app/service/role.guard.ts`. Redirige vers `/login` si pas de token, vers `/` si token présent mais rôle insuffisant.
>   ```
>   canActivate: [roleGuard(['ROLE_ADMIN'])]       ← route /admin
>   canActivate: [roleGuard(['ROLE_MODERATOR'])]   ← route /moderator
>   canActivate: [roleGuard(['ROLE_ADVISOR'])]     ← route /advisor
>   ```

> **Risque résiduel**
> - Token stocké en sessionStorage : vulnérable aux attaques XSS. Plus sécurisé : cookie HttpOnly.

---

## 8. INTÉGRATIONS TIERCES

| Service | SDK/Lib | Usage | Config requise |
|---|---|---|---|
| Google Analytics 4 | Script GA inline | Tracking visites | ID hardcodé dans `index.html` : `G-Q377ERR21S` |
| PrimNG | `primeng ^17.18.2` | Composants UI (dialogs, tables, carousel, rating...) | Thème CSS dans `angular.json` |
| Bootstrap | `bootstrap ^4.5.0` | Grid, utilitaires, navbar responsive | CSS + JS dans `angular.json` |
| Angular Material | `@angular/material ^17.3.10` | Thème pink-bluegrey, animations | Thème CSS dans `angular.json` |
| Quill.js | `quill ^2.0.2` via PrimNG Editor | Éditeur rich-text pour articles et descriptions | CSS importé dans `styles.scss` |
| intl-tel-input | `ngx-intl-tel-input ^3.2.0` | Saisie numéro téléphone international (module orientation) | CSS dans `angular.json` |
| jQuery | `jquery ^3.7.1` | Interactions DOM (legacy, chargé globalement) | Scripts dans `angular.json` |
| Express | `express ^4.18.2` | Serveur SSR Node.js | `server.ts` |
| sitemap | `sitemap ^8.0.0` | Génération `sitemap.xml` | Fichier statique `src/sitemap.xml` |

---

## 9. DESIGN SYSTEM & STYLES

### Architecture CSS (ordre de chargement dans `angular.json`)

1. `intl-tel-input/build/css/intlTelInput.css` — phone input
2. `@angular/material/prebuilt-themes/pink-bluegrey.css` — thème Material
3. `bootstrap/dist/css/bootstrap.min.css` — grid Bootstrap 4
4. `src/styles.scss` — styles globaux projet
5. `primeng/resources/themes/lara-light-blue/theme.css` — thème PrimNG
6. `primeng/resources/primeng.min.css` — styles PrimNG de base

### Design System centralisé

**Fichier de référence** : `src/styles/_design-system.scss`

Toute la charte graphique est centralisée dans ce fichier. Il suffit d'un seul import depuis n'importe quel composant :

```scss
@import 'design-system';  // fonctionne depuis n'importe quel composant
```

Cela est possible grâce à `stylePreprocessorOptions.includePaths: ["src/styles"]` dans `angular.json`.

#### Tokens de couleurs

| Variable | Valeur | Usage |
|---|---|---|
| `$bg` | `#f8fafc` | Fond page (gris très clair) |
| `$bg-alt` / `$bg-card` | `#ffffff` | Fond carte / section alternée |
| `$border` | `#e2e8f0` | Bordures |
| `$shadow` | `0 1px 3px …` | Ombre douce |
| `$shadow-md` | `0 4px 24px …` | Ombre prononcée |
| `$text` | `#1e293b` | Texte principal |
| `$text-muted` | `#64748b` | Texte secondaire |
| `$accent` | `#059669` | Vert — couleur principale |
| `$accent-dark` | `#047857` | Vert foncé (hover) |
| `$accent-bg` | `rgba(5,150,105,0.07)` | Fond vert transparent |
| `$accent-border` | `rgba(5,150,105,0.20)` | Bordure verte |
| `$accent2` | `#2563eb` | Bleu — couleur secondaire |
| `$accent2-bg` | `rgba(37,99,235,0.07)` | Fond bleu transparent |
| `$accent2-border` | `rgba(37,99,235,0.18)` | Bordure bleue |
| `$wsp-green` | `#25d366` | Vert WhatsApp |

#### Classes utilitaires fournies

| Classe | Description |
|---|---|
| `.section-badge` | Petit label pill vert uppercase (ex: "Établissements partenaires") |
| `.section-header` | En-tête de section centré (badge + h2 + `.section-subtitle`) |
| `.text-accent` | Texte en dégradé vert→bleu |
| `.btn-primary-cta` | Bouton CTA vert dégradé avec icône |
| `.btn-ghost-cta` | Bouton CTA outline neutre |
| `.btn-wsp` | Bouton WhatsApp vert |
| `.btn-outline-neutral` | Bouton outline pill (ex: "Voir plus") |
| `.feature-icon` / `.value-icon` | Icône carré arrondi vert ; modifier `.--blue` pour bleu |
| `.cd-card` | Carte générique avec hover élévation |
| `.cd-chip` | Tag/chip vert (ex: fiche métier) |
| `.cd-highlight` | Bloc citation avec bordure gauche verte |
| `.animate-fade-up` | Animation `fadeInUp` 0.5s |

#### Composants utilisant le design-system (15 fichiers)

- `landing-page.component.scss`
- `about.component.scss`
- `orientation-v2.component.scss`
- `info-metier.component.scss`
- `info-metier-item.component.scss`
- `info-ecole-item.component.scss`
- `mon-avis.component.scss`
- `avis-start.component.scss`
- `single-actu.component.scss`
- `actu.component.scss`
- `register.component.scss`
- `legal.component.scss`
- `condition.component.scss`
- `politique.component.scss`
- `informations-style.module.scss`

> Pour tout nouveau composant public, ajouter `@import 'design-system'` en première ligne du `.scss`.

### Typographie

- **Police principale** : Roboto (définie dans `styles.scss` : `font-family: Roboto, "Helvetica Neue", sans-serif`)
- Google Fonts commenté dans `index.html` — Roboto chargé via Angular Material

### Icônes

- **PrimeIcons** : `primeicons ^7.0.0` — icônes PrimNG (`pi pi-*`)
- **Bootstrap Icons** : `bootstrap-icons ^1.11.3` — icônes Bootstrap (`bi bi-*`)

### Breakpoints responsive

Hérités de Bootstrap 4 :

| Breakpoint | Taille |
|---|---|
| xs | < 576px |
| sm | ≥ 576px |
| md | ≥ 768px |
| lg | ≥ 992px |
| xl | ≥ 1200px |

### Composants UI disponibles (via PrimNG)

Dialog, TreeSelect, FileUpload, Rating, InputTextarea, OrderList, RadioButton, Editor (Quill), Image, Carousel, ProgressSpinner, ProgressBar, Menubar, Fieldset, Divider, Card, Accordion, TabView, Table, Button, OrganizationChart, Tag, Dropdown, **Message** (`severity` valide : `success | info | warning | danger | help | primary | secondary | contrast` — ⚠️ PAS `"error"`). 

### Styles propres au projet

- `src/styles.scss` : uniquement `html/body` height, font, imports librairies, `.titre { text-align: center }`
- `src/app/admin/admin-style.module.scss` : styles spécifiques au module admin
- Styles par composant : chaque composant a son `.scss` encapsulé

---

## 10. VARIABLES D'ENVIRONNEMENT

| Variable | Obligatoire | Valeur dev | Valeur prod | Description |
|---|---|---|---|---|
| `environment.production` | Oui | `false` | `true` | Mode production Angular |
| `environment.apiUrl` | Oui | `http://localhost:3000` | `https://nodeapp.camerdiplome.com` | URL de base du backend Node.js |

> **Note** : Pas de fichier `.env`. Les variables sont dans `src/environments/environment*.ts` et compilées dans le bundle. Pour ajouter une variable, l'ajouter dans les deux fichiers environment et rebuilder.

**Hardcodé dans `index.html`** (ne pas oublier si l'ID GA change) :
- Google Analytics ID : `G-Q377ERR21S`

---

## 11. SCRIPTS DISPONIBLES

| Commande | Description | Quand l'utiliser |
|---|---|---|
| `npm start` | Lance `ng serve` — dev server sur http://localhost:4200 | Développement quotidien |
| `npm run build` | Build production dans `dist/cdfront/` | Préparer un déploiement |
| `npm run watch` | Build watch mode en configuration development | Dev avec HMR manuel |
| `npm test` | Lance Karma/Jasmine | Exécuter les tests unitaires |
| `npm run serve:ssr` | Lance le serveur SSR Express compilé | Tester le SSR en local après build |
| `ng generate component X` | Générer un composant | Créer un nouveau composant |
| `ng generate service X` | Générer un service | Créer un nouveau service |

---

## 12. DETTES TECHNIQUES & POINTS D'ATTENTION

### Sécurité

1. ~~**`AuthInterceptor` non enregistré**~~ **CORRIGÉ (2026-05-09)** : `AuthInterceptor` enregistré dans `app.config.ts` via `withInterceptorsFromDi()`. Le token JWT est désormais envoyé automatiquement dans les headers HTTP.

2. ~~**Aucun route guard sur `/admin`**~~ **CORRIGÉ (2026-06-11)** : `roleGuard(allowedRoles[])` (fonctionnel `CanActivateFn` paramétrable) créé dans `src/app/service/role.guard.ts`, appliqué sur `/admin` (`ROLE_ADMIN`) et `/moderator` (`ROLE_MODERATOR`). Remplace l'ancien `authGuard` qui ne vérifiait que la présence du token sans contrôle de rôle.

3. **Token en sessionStorage** : Vulnérable aux attaques XSS. Plus sécurisé : cookie HttpOnly.

### Bugs connus

4. **`LoaderService.setLoading()` bugué** (`src/app/service/loader.service.ts`, ligne 14) : La méthode `setLoading(loading: boolean)` assigne toujours `false` au lieu de la valeur passée en paramètre. Ce service semble non utilisé (remplacé par `SpinerService`), mais reste dans le code.

### Architecture

5. **Architecture hybride incohérente** : Mélange de composants standalone (Angular 17) et de NgModules traditionnels. Les feature modules (admin, info, orientation...) déclarent `declarations: []` vide et utilisent des composants standalone dans les routes — pattern valide mais inhabituel.

6. ~~**Pas de fichier de constantes pour les endpoints API**~~ **CORRIGÉ (2026-05-09)** : Tous les endpoints centralisés dans `src/app/constants/api-endpoints.ts` (objet `API` en `as const`). Les 7 services HTTP importent désormais ce fichier — aucune URL inline restante.

7. **Services LoaderService et SpinerService redondants** : Deux services pour la même responsabilité (loading state). `LoaderService` semble être l'ancien, `SpinerService` l'actuel.

8. **`GeneralService`** (`src/app/general.service.ts`) : Service legacy, encore importé dans `student-avis/components/avis-start/`. À évaluer avant suppression.

### Performance

9. **Multiple frameworks CSS chargés simultanément** : Bootstrap 4 + Angular Material + PrimNG. Charge CSS importante, risque de conflits de styles.

10. **Image `camera.jpg` non optimisée** : 1.5 MB chargée en asset statique. À convertir en WebP.

11. **`OnPush` change detection non utilisée** : Aucun composant n'utilise `ChangeDetectionStrategy.OnPush`. Sur les pages avec des listes longues (écoles, formations), cela peut impacter les performances.

12. **jQuery chargé globalement** : `jquery.slim.min.js` et `bootstrap.bundle.min.js` chargés via `angular.json` scripts — déjà inclus dans Bootstrap bundle, duplication possible.

### Code mort / TODO

13. **`board-admin/`** : Dossier `src/app/board-admin/` (composant legacy BoardAdmin) probablement remplacé par le module `admin/`.

14. **`/view` route** : `UsertestComponent` semble être une route de test développeur.

15. **`vomments/`** : Faute de frappe dans le nom (devrait être `comments/`).

16. **Code commenté dans `app.component.ts`** : Suggestions d'anciens essais de state management.

---

## 13. GUIDE POUR NOUVELLES FONCTIONNALITÉS

### Checklist pour une nouvelle page publique simple

```
1. Créer le composant standalone :
   ng generate component nom-feature --standalone

2. Ajouter la route dans src/app/app.routes.ts :
   { path: 'nom-route', component: NomFeatureComponent }

3. Si la page nécessite des données :
   - Créer ou réutiliser un service dans src/app/service/
   - Injecter le service dans le composant
   - Appeler l'API dans ngOnInit()

4. Styles : utiliser Bootstrap 4 grid + classes PrimNG ou custom SCSS
   dans le fichier .scss du composant

5. Si la page doit être indexée SEO : ajouter au prerendering dans routes.txt
```

### Checklist pour un nouveau module feature lazy-loaded

```
1. Créer le module :
   ng generate module nom-module --routing

2. Ajouter le lazy load dans app.routes.ts :
   { path: 'chemin', loadChildren: () => import('./nom-module/nom-module.module').then(m => m.NomModule) }

3. Définir les routes dans nom-module-routing.module.ts
   avec des composants standalone

4. Créer le service associé : src/app/nom-module/nom-module.service.ts
   avec BehaviorSubject pour chaque entité gérée

5. Créer les modèles dans src/app/nom-module/models/ ou src/app/model/
```

### Checklist pour une nouvelle section admin (nouvelle entité)

```
1. Créer le modèle dans src/app/admin/models/nouvelle-entite.model.ts

2. Ajouter dans AdminService (src/app/admin/admin.service.ts) :
   - BehaviorSubject pour la liste
   - get observable$()
   - getFromServer() → GET /api/nouvelle-entite
   - addNew() → POST /api/nouvelle-entite
   - edit() → PUT /api/nouvelle-entite
   - deletById(id) → DELETE /api/nouvelle-entite?id={id}

3. Créer les composants :
   - admin/components/list-nouvelle-entite/
   - admin/components/new-nouvelle-entite/
   - admin/components/modif-nouvelle-entite/
   - admin/components/single-nouvelle-entite/

4. Ajouter les routes dans admin-routing.module.ts :
   { path: 'nouvelle-entite', component: ListNouvelleEntiteComponent }
   { path: 'new-nouvelle-entite', component: NewNouvelleEntiteComponent }
   { path: 'modif-nouvelle-entite/:id', component: ModifNouvelleEntiteComponent }
   { path: 'nouvelle-entite/:id', component: SingleNouvelleEntiteComponent }
```

### Conventions de nommage

| Type | Convention | Exemple |
|---|---|---|
| Composant | kebab-case dossier, PascalCase classe | `new-ecole/` → `NewEcoleComponent` |
| Service | camelCase fichier + `Service` | `admin.service.ts` → `AdminService` |
| Modèle | kebab-case fichier + `.model.ts` | `ecole.model.ts` → `class Ecole` |
| Observable$ | suffixe `$` | `_ecole$`, `loading$` |
| Interface de formulaire | suffixe `Form` | `EtsForm` |
| Pipe | camelCase | `myfilter.pipe.ts` → `MyFilterPipe` |

### Authentification — état actuel (2026-06-12)

L'authentification est **entièrement opérationnelle** :

- **Guard** : `src/app/service/role.guard.ts` — guard paramétrable `roleGuard(allowedRoles[])` appliqué sur `/admin`, `/moderator` et `/advisor`. Redirige vers `/login` si pas de token, vers `/` si rôle insuffisant.
- **Interceptor** : `AuthInterceptor` enregistré dans `app.config.ts` via `provideHttpClient(withInterceptorsFromDi())`. Le token JWT est injecté automatiquement dans tous les headers `x-access-token`.
- **Login** : Après connexion réussie, redirection basée sur le rôle (ordre de priorité) : `ROLE_ADVISOR` → `/advisor/advisorStart`, `ROLE_MODERATOR` → `/moderator/modStart`, sinon → `/admin`.

Pour protéger une nouvelle route par rôle :
```typescript
{ path: 'ma-route', ..., canActivate: [roleGuard(['ROLE_ADMIN'])] }
{ path: 'autre', ..., canActivate: [roleGuard(['ROLE_MODERATOR'])] }
{ path: 'conseil', ..., canActivate: [roleGuard(['ROLE_ADVISOR'])] }
{ path: 'mixte', ..., canActivate: [roleGuard(['ROLE_ADMIN', 'ROLE_MODERATOR'])] }
```

### Règle DI Angular 17+ avec Vite

**Ne jamais injecter `Router` en paramètre de constructeur dans les composants standalone** — Vite ne génère pas `emitDecoratorMetadata`, ce qui provoque `TS-992003`. Utiliser systématiquement `inject()` en champ de classe :

```typescript
// ✅ Correct (Angular 17+ avec Vite)
private router = inject(Router);

// ❌ Incorrect pour les composants standalone avec Vite
constructor(private router: Router) {}
```

Cette règle s'applique à `Router`. Les services internes (AdminService, tokenStorageService) fonctionnent en constructeur car ils ont `@Injectable()` avec les métadonnées appropriées.

---

## 14. GLOSSAIRE MÉTIER

| Terme | Type TypeScript | Définition telle qu'implémentée |
|---|---|---|
| **Ecole** | `class Ecole` (`admin/models/ecole.model.ts`) | Établissement d'enseignement privé ou technique. Possède un logo, un niveau, une langue d'enseignement, un directeur, des décrets de création/ouverture. Rattaché à une `Universite` via `universites_id`. |
| **Universite** | `class Universite` (`admin/models/univ.model.ts`) | Institution universitaire (publique ou privée). Possède un type (`type_univ`), une ville, un recteur. Les écoles lui sont rattachées. |
| **Campus** | `class Campus` (`admin/models/campus.model.ts`) | Site physique d'une école. Possède des coordonnées GPS (`lon_camp`, `lat_camp`), une ville, un téléphone (`tel_camp`), un flag `principal_camp`. Une école peut avoir plusieurs campus (jusqu'à 10 campus_id sur une école). |
| **Formation** | `class Formation` (`admin/models/formation.model.ts`) | Programme d'études proposé par une école. Combine une école + un diplôme + une catégorie + un domaine. Possède une durée (`duree_f`), un coût (`cout_f`), un programme, et des conditions d'admission. |
| **Diplome** | `class Diplome` (`admin/models/diplome.model.ts`) | Titre académique délivré (ex : BTS, Licence, Master). Appartient à une `Categ` et possède un `groupe` et un `niveau`. |
| **Categ** | `class Categ` (`admin/models/categ.model.ts`) | Catégorie de diplôme. Regroupe les diplômes de même nature (ex : "Technicien Supérieur", "Licence Professionnelle"). |
| **Domaine** | `class Domaine` (`admin/models/domaine.model.ts`) | Champ disciplinaire (ex : Informatique, Gestion, Santé). Possède une `branche_dom` (sous-domaine), des sections descriptives (intégration professionnelle, débouchés). |
| **Filiere** | Concept métier | Non modélisé explicitement — correspond à la combinaison Domaine + Branche. Utilisé comme terme UI pour désigner un cursus dans un domaine donné. |
| **Orientation** | Module Angular | Tunnel de questionnaire multi-étapes permettant à un étudiant de trouver des formations adaptées. Collecte : ville, niveau diplôme souhaité, domaine, statut, classe, dernier diplôme, contact. |
| **Resultats** | `class interestelt` (`model/interest-item-model.ts`) | Résultat d'une recherche d'orientation — formation avec école associée, diplôme, localisation, coût. Affiché dans `ResultatsComponent`. |
| **Avis** | `class Avis` (`model/avis-model.ts` + `admin/models/`) | Avis d'étudiant sur une école. Multi-critères : cours, ambiance, locaux, insertion professionnelle. Chaque critère a un contenu texte et une note numérique. Inclut une recommandation et une justification. |
| **EcoleAvis** | `class EcoleAvis` (`model/ecole-avis-model.ts`) | Agrégat d'une école avec sa note moyenne (`notes_moy`) et le nombre d'avis (`occurence`). Affiché sur la page de liste des avis. |
| **Cursus** | `class Cursus` (`model/cursus-model.ts`) | Curriculum/parcours académique proposé par une école pour un diplôme donné. Utilisé dans le module avis pour identifier la filière d'un étudiant laissant un avis. |
| **Actualite** | `class Actualite` (`model/actualite.ts`) | Article de blog/news. Possède un titre, auteur, résumé, illustration, contenu HTML, sujets et mots-clés. Le champ `sujets` sert de slug pour la route `/actualite/blog/:subject`. |
| **Article** | `class Article` (`admin/models/article.model.ts`) | Équivalent admin de `Actualite` (modèle légèrement différent, inclut `updatedDate`). Géré via l'AdminService. |
| **TopNews** | `class TopNews` (`model/top-news-model.ts`) | Élément du carrousel d'actualités en tête de page d'accueil. Distinct des articles blog normaux. |
| **Advers** | `FormationAdvers`, `SchoolAdvers` | Publications sponsorisées/mises en avant. Les formations et écoles peuvent être promues via l'AdversService. Affichées dans des composants `Pub*`. |
| **UserProfil** | `class UserProfil` (`model/user-profil-model.ts`) | Profil collecté pendant le tunnel d'orientation : ville, diplôme recherché, domaine, statut, nom, prénom, date de naissance, email, téléphone. Envoyé au backend à l'étape contact. |
| **Etablissement** | Terme UI / `EtsForm` | Terme générique pour désigner une école ou université dans les formulaires de contact (`postEts()`). |
| **Ville** | `class ville` (`model/ville-model.ts`) | Ville camerounaise disponible dans le tunnel d'orientation. Filtrée selon le diplôme et le domaine choisis. |
| **Branche** | Propriété de `Domaine` et `field` | Sous-domaine ou spécialisation au sein d'un domaine (ex : dans "Informatique" : "Développement", "Réseaux", "Cybersécurité"). |
| **Niveau** | Propriété de `Diplome` et `Ecole` | Niveau d'études requis ou dispensé (ex : "Bac+2", "Bac+3", "Bac+5"). |
| **Slug** | Paramètre de route | Version URL-safe du nom d'une école ou d'un domaine, utilisée dans les routes `/info/ecole/:slug/:id` et `/info/domaine/:slug/:id` pour le SEO. |

---

## 15. ARCHITECTURE SEO

### Vue d'ensemble

La stratégie SEO repose sur trois piliers :
1. **SSR Angular** — rendu côté serveur pour que les crawlers voient le HTML complet
2. **Prerendering statique** — génération des pages au build pour les URL connues
3. **Title/Meta service** — injection dynamique des balises `<title>` et `<meta>` par composant

Depuis la création du `SeoService` (`src/app/service/seo.service.ts`), les balises Open Graph, Twitter Card, liens `canonical` et données structurées JSON-LD sont gérées de manière centralisée. 13 composants l'utilisent désormais.

---

### Fichiers SEO statiques

| Fichier | Emplacement | Contenu |
|---|---|---|
| `robots.txt` | `src/robots.txt` | `User-agent: *` + `Disallow:` (tout autorisé) + `Sitemap: https://www.camerdiplome.com` |
| `sitemap.xml` | `src/sitemap.xml` | Fichier statique (à maintenir manuellement ou à regénérer avec la lib `sitemap`) |

Le `robots.txt` ne pointe pas vers `/sitemap.xml` mais vers le domaine racine — à corriger si le sitemap est un fichier distinct.

---

### Prerendering (routes.txt)

Configuré dans `angular.json` (`"prerender": { "routesFile": "routes.txt" }`).

Le fichier `routes.txt` contient **~310 routes** prérendues au build :

| Groupe | Nombre | Exemple |
|---|---|---|
| Fiches école `/info/ecole/:slug/:id` | ~185 | `/info/ecole/pigier-cameroun.../52` |
| Pages domaine `/info/domaine/:slug/:id` | ~120 | `/info/domaine/formations-en-informatique-au-cameroun/90` |
| Articles blog `/actualite/blog/:subject` | 3 | `/actualite/blog/competences` |

> **Important** : Toute nouvelle école ou nouveau domaine ajouté en base doit être ajouté manuellement à `routes.txt` pour être prérendu. Les routes statiques (`/info/bts`, `/`, etc.) sont prérendues automatiquement par Angular SSR.

---

### Gestion Title/Meta par composant

La gestion est entièrement **manuelle et décentralisée** — chaque composant injecte `Title` et/ou `Meta` depuis `@angular/platform-browser` et appelle `setTitle()` / `updateTag()` dans son constructeur ou `ngOnInit()`.

Il n'existe **pas** de système centralisé (pas de `TitleResolver`, pas de `data: { title }` dans le routing, pas de service SEO dédié).

#### Pages statiques `/info/*` — meta gérés ✅

| Route | Composant | Title | description | keywords |
|---|---|---|---|---|
| `/info/diplome` | `InfoDiplomeComponent` | ✅ | ✅ | ✅ |
| `/info/system` | `InfoSystemComponent` | ✅ | ✅ | ✅ |
| `/info/cap` | `InfoCapComponent` | ✅ | ✅ | ✅ |
| `/info/bactec` | `InfoBacTechniqueComponent` | ✅ | ✅ | ✅ |
| `/info/cqp` | `InfoCqpComponent` | ✅ | ✅ | ✅ |
| `/info/capacite` | `InfoCapaciteComponent` | ✅ | ✅ | ✅ |
| `/info/prepa` | `InfoPrepaComponent` | ✅ | ✅ | ✅ |
| `/info/bts` | `InfoBtsComponent` | ✅ | ✅ | ✅ |
| `/info/hnd` | `InfoHndComponent` | ✅ | ❌ | ❌ |
| `/info/dut` | `InfoDutComponent` | ✅ | ✅ | ✅ |
| `/info/licence` | `InfoLicenceComponent` | ✅ | ✅ | ✅ |
| `/info/licencepro` | `InfoLicenceProComponent` | ✅ | ✅ | ✅ |
| `/info/bachelor` | `InfoBachelorComponent` | ✅ | ❌ | ❌ |
| `/info/master` | `InfoMasterComponent` | ✅ | ✅ | ✅ |
| `/info/ecole` | `InfoEcoleComponent` | ✅ | ❌ | ❌ |
| `/info/metier` | `InfoMetierComponent` | ✅ | ❌ | ❌ |

Tous ces composants font le `setTitle()` dans le **constructeur** avec une valeur statique hardcodée.

#### Pages de détail dynamiques — état mixte ⚠️

| Route | Composant | Title | description | Méthode |
|---|---|---|---|---|
| `/info/ecole/:slug/:id` | `InfoEcoleItemComponent` | ✅ dynamique | ✅ dynamique | `ngOnInit()` → `tap()` → `initMetaForMyPage()` après fetch API |
| `/info/domaine/:slug/:id` | `InfoDomaineItemComponent` | ❌ absent | ❌ absent | — |
| `/info/formation/:id` | `InfoFormationItemComponent` | ❌ absent | ❌ absent | — |
| `/info/metier/:id` | `InfoMetierItemComponent` | ❌ absent | ❌ absent | — |

> **Gap SEO critique** : Les pages `/info/domaine/*` et `/info/formation/*` sont dans `routes.txt` (prérendues), mais **sans titre ni description**. Le crawler voit le HTML du contenu mais avec un `<title>Cdfront</title>` par défaut (celui de `index.html`).

#### Module actualite

| Route | Composant | Title | description | Méthode |
|---|---|---|---|---|
| `/actualite/blog/:subject` | `SingleActuComponent` | ✅ dynamique | ✅ dynamique | `ngOnInit()` → `initMetaForMyPage()` après fetch (utilise `actualite.title` et `actualite.summary`) |
| `/actualite/actues` | `ActuComponent` | ❌ absent | ❌ absent | — |

#### Page d'accueil

| Route | Composant | Title | description | keywords |
|---|---|---|---|---|
| `/` | `LandingPageComponent` | ✅ | ✅ | ✅ |
| Valeur | — | `"Formations Professionnelles au Cameroun \| Camerdiplome"` | `'Trouvez le diplôme et l\'école...'` | `'formation, professionnelle, ecoles, Cameroun...'` |

---

### Balises meta gérées via SeoService

| Balise | Gérée | Note |
|---|---|---|
| `<title>` | ✅ | Via `SeoService.setSeo()` → `Title.setTitle()` |
| `<meta name="description">` | ✅ | Via `SeoService.setSeo()`, tronqué à 160 chars |
| `<meta name="keywords">` | ✅ partiellement | Via `SeoService.setSeo()` si fourni |
| `<meta property="og:title">` | ✅ | Via `SeoService.setSeo()` |
| `<meta property="og:description">` | ✅ | Via `SeoService.setSeo()` |
| `<meta property="og:image">` | ✅ | Via `SeoService.setSeo()` (défaut: `home.webp`) |
| `<meta property="og:url">` | ✅ | Via `SeoService.setSeo()` |
| `<meta name="twitter:card">` | ✅ | `summary_large_image` |
| `<meta name="twitter:title/description/image">` | ✅ | Via `SeoService.setSeo()` |
| `<link rel="canonical">` | ✅ | Via `SeoService.setSeo()` |
| JSON-LD BreadcrumbList | ✅ | Via `SeoService.setBreadcrumb()` |

---

### Patron d'implémentation recommandé pour les pages SEO

Utiliser `SeoService.setSeo()` — ne plus injecter `Title`/`Meta` directement :

```typescript
constructor(private seo: SeoService) {}

private initMeta(): void {
  this.seo.setSeo({
    title:       `${this.domaine.nom_dom} au Cameroun | Camerdiplome`,
    description: `Formations en ${this.domaine.nom_dom} dans les meilleures écoles du Cameroun...`,
    url:         `/info/domaine/${this.slug}/${this.id}`,
    keywords:    `${this.domaine.nom_dom}, formation, Cameroun`,
  });
}
```

---

### `index.html` — état des balises statiques

```html
<title>Cdfront</title>                          <!-- titre par défaut — remplacé dynamiquement -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- Pas de meta description statique -->
<!-- Pas de og: tags -->
<!-- Google Analytics G-Q377ERR21S intégré inline -->
```

---

## 16. WORKFLOW ORIENTATION — Tunnel "Trouver ma formation"

> Ce workflow est le cœur de la plateforme. Il collecte le profil d'un étudiant en 6 étapes (8 sous-étapes selon le statut) et retourne une liste de formations adaptées.

### Point d'entrée

**Fichier** : `src/app/landing-page/landing-page.component.html` (ligne ~24)

```html
<a routerLink="/orientation/degree" class="btn-primary-cta">
  <i class="bi bi-compass-fill"></i>
  Trouver ma formation
</a>
```

Un simple `routerLink` vers `/orientation/degree`. Aucune logique, aucune condition — n'importe qui peut démarrer le tunnel sans être connecté.

---

### Architecture du module orientation

**Module** : `src/app/orientation/orientation.module.ts` — lazy-loadé depuis `app.routes.ts`  
**Routing** : `src/app/orientation/orientation-routing.module.ts`  
**Service central** : `src/app/orientation/orientation.service.ts`

```
orientation/
├── orientation.module.ts
├── orientation-routing.module.ts
├── orientation.service.ts
└── components/
    ├── degree/          ← Étape 1 : diplôme visé
    ├── field/           ← Étape 2 : domaine/filière
    ├── city/            ← Étape 3 : ville
    ├── statuts/         ← Étape 4 : statut de l'étudiant
    ├── classe/          ← Étape 5a : niveau scolaire (lycéens)
    ├── etudiant/        ← Étape 5b : niveau universitaire (étudiants)
    ├── dernierdiplome/  ← Étape 5c : dernier diplôme (actifs/chômeurs)
    ├── contact/         ← Étape 6 : informations personnelles
    └── resultats/       ← Étape 7 : affichage des résultats
```

---

### State management : OrientationService

**Fichier** : `src/app/orientation/orientation.service.ts`

L'état du tunnel est stocké dans un **objet en mémoire** (`initialUser`) et des **BehaviorSubjects** pour les données issues de l'API.

**Objet `initialUser`** (accumulé au fil des étapes) :

```typescript
initialUser = {
  id: 0,
  city: '',        // Étape 3
  degree: '',      // Étape 1
  field: '',       // Étape 2
  branche: '',     // Étape 2 (sous-domaine)
  name: '',        // Étape 6
  surname: '',     // Étape 6
  level: '',       // Étape 5a/b/c
  statuts: '',     // Étape 4
  bornDate: 0,     // Étape 6
  country: '',     // Étape 6
  email: '',       // Étape 6
  tel: ''          // Étape 6
}
```

**BehaviorSubjects** :

| Subject | Type | Alimenté par |
|---|---|---|
| `_loading$` | `boolean` | État de chargement global |
| `_cyties$` | `ville[]` | `getAllCyties()` / `getPartCyties()` |
| `_domaine$` | `field[]` | `getDomaineFromServer()` / `getPartDomaine()` |
| `_degree$` | `degree[]` | `getDegreeCyti()` / `getDegreeField()` |
| `_school$` | `interestelt[]` | `getSerchResult()` (résultats finaux) |

**Point d'attention** : `initialUser` n'est jamais réinitialisé automatiquement entre deux tunnels. La méthode `initUser()` existe mais doit être appelée manuellement. Si l'utilisateur relance un nouveau tunnel sans refresh, les données précédentes persistent.

---

### Étapes du tunnel — détail complet

#### Étape 1 — Degree `/orientation/degree`

**Question** : "Quel diplôme souhaitez-vous préparer ?"  
**Composant** : `DegreeComponent`  
**Barre de progression** : 20%

**UI** : 7 accordéons Bootstrap (CAP, Bac, Bac+1/2, Bac+3, Bac+4/5, Bac+6+, Autre), chaque section contenant des boutons de diplômes filtrés par `groupe` via le pipe `myfilter`.

**API appelée au chargement** :
```
GET /api/degree?DegreeCyti=tous → retourne TOUTES les catégories de diplômes
```

**Navigation conditionnelle** (paramètres en query string) :
```
Si field && !cyti  → /orientation/field?degree={selected}
Si field && cyti   → /orientation/statuts?degree={selected}&field={...}&cyti={...}
Si !field && !cyti → /orientation/field?degree={selected}  (cas normal)
```

Le choix est passé en **query param** uniquement — pas encore sauvegardé dans `initialUser`.

---

#### Étape 2 — Field `/orientation/field`

**Question** : "Dans quelle filière souhaitez-vous effectuer votre formation ?"  
**Composant** : `FieldComponent`  
**Barre de progression** : 50%

**UI** : 15 accordéons regroupés par branche (Agriculture, Informatique, Santé, Commerce, etc.). Boutons filtrés par `domfilter` pipe selon `branche_dom`.

**API appelée au chargement** :
```
GET /api/field?DomaineDegree={degree} → domaines liés à ce type de diplôme
```

**Navigation conditionnelle** :
```
Si degree && !cyti  → /orientation/city?field={field}&branche={branche}&degree={degree}
Si degree && cyti   → /orientation/statuts?degree={}&field={}&branche={}&cyti={}
Si !degree          → /orientation/degree?field={field}  (retour en arrière)
```

`field` et `branche` passés en query params.

---

#### Étape 3 — City `/orientation/city`

**Question** : "Dans quelle ville souhaitez-vous suivre votre formation ?"  
**Composant** : `CityComponent`  
**Barre de progression** : 70%

**UI** : Liste de boutons par ville + option "Cameroun entier".

**API appelée au chargement** (conditionnelle) :
```
Si degree && field:
  GET /api/partCyties?Degree={degree}&Domaine={field}  → villes avec formations correspondantes
Sinon:
  GET /api/cyties  → toutes les villes ayant un campus
```

**Navigation** :
```
Si degree && field → /orientation/statuts?degree={}&field={}&branche={}&cyti={city}
Sinon              → /orientation/degree?cyti={city}
```

---

#### Étape 4 — Statuts `/orientation/statuts`

**Question** : "Je suis :"  
**Composant** : `StatutsComponent`  
**Barre de progression** : 85%

**UI** : 4 boutons (Lycéen/Collégien, Étudiant, En activité, Sans emploi).

**Première sauvegarde dans `initialUser`** (méthode `saveStatut()`) :
```typescript
initialUser.degree  = degree    // récupéré des query params
initialUser.field   = field
initialUser.branche = branche
initialUser.city    = cyti
initialUser.statuts = statut
```

**Navigation conditionnelle (branching)** :
```
'lycéen'              → /orientation/classe
'étudiant'            → /orientation/etudiant
'en activité' | autre → /orientation/dernierDiplome
```

---

#### Étape 5a — Classe `/orientation/classe` *(path lycéen)*

**Question** : "En quelle classe êtes-vous ?"  
**Composant** : `ClasseComponent`  
**Barre de progression** : 90%

**UI** : 7 boutons (Terminale → 6e).

**Sauvegarde** : `saveClasse(classe)` → `initialUser.level = classe`  
**Navigation** : toujours vers `/orientation/contact`

---

#### Étape 5b — Étudiant `/orientation/etudiant` *(path étudiant)*

**Question** : "Quel est votre niveau d'étude actuel ?"  
**Composant** : `EtudiantComponent`  
**Barre de progression** : 90%

**UI** : 7 boutons (Bac → Bac+6 et plus).

**Sauvegarde** : `saveClasse(niveau)` → `initialUser.level = niveau`  
**Navigation** : toujours vers `/orientation/contact`

---

#### Étape 5c — Dernier diplôme `/orientation/dernierDiplome` *(path actif/chômeur)*

**Question** : "En quelle Bac+ êtes-vous aujourd'hui ?"  
**Composant** : `DernierdiplomeComponent`  
**Barre de progression** : 90%

**UI** : 10 boutons (CEP → Bac+6) + bouton "Aucun diplôme".

**Sauvegarde** : `saveClasse(niveau)` → `initialUser.level = niveau`  
**Navigation** : toujours vers `/orientation/contact`

---

#### Étape 6 — Contact `/orientation/contact`

**Question** : "Dernière étape avant de voir les résultats"  
**Composant** : `ContactComponent`  
**Barre de progression** : 95%

**UI** : Formulaire réactif Angular avec :
- Nom (required)
- Prénom (required)
- Année de naissance (dropdown 1970–2009, required)
- Pays de nationalité (required)
- Email (required, format email)
- Téléphone (ngx-intl-tel-input, preferred: cm/ga/td, required)

Bouton "Valider et voir mes résultats" désactivé jusqu'à ce que le formulaire soit valide.

**À la soumission** — méthode `saveContact()` :
1. Complète `initialUser` avec les données du formulaire
2. POST `/api/result` avec `initialUser` complet → sauvegarde le profil en BDD (table `clients`)
3. Navigate vers `/orientation/resultats`

**`UserProfil` complet à ce stade** :
```typescript
{
  city: 'Yaoundé',
  degree: 'BTS',
  field: 'Informatique',
  branche: 'Développement Web',
  statuts: 'lycéen',
  level: 'Terminale',
  name: 'Dupont',
  surname: 'Jean',
  bornDate: 2006,
  country: 'Cameroun',
  email: 'jean@example.com',
  tel: '+237 6 00 00 00 00'
}
```

---

#### Étape 7 — Resultats `/orientation/resultats`

**Affichage** : "Les formations susceptibles de vous intéresser"  
**Composant** : `ResultatsComponent`  
**Barre de progression** : 100%

**API appelée au chargement** :
```
GET /api/result?city={initialUser.city}&diplome={initialUser.degree}&domaine={initialUser.field}&branche={initialUser.branche}
```

Retourne un tableau d'`interestelt[]` — résultats d'une procédure stockée MySQL (`serch_result_procedure`) qui :
- Groupe les diplômes par famille (ex: "BTS" inclut aussi "HND", "DUT", "DSEP")
- Filtre par ville (LIKE)
- Filtre par domaine (LIKE)
- Trie les résultats exacts en premier

**Chaque résultat affiché** (via composant partagé `app-pub-interest-item`) :
- Nom du diplôme, catégorie, école, ville
- Logo, coût de la formation
- Description, conditions d'admission
- Contacts école (téléphone, email, site web)

**Action utilisateur** : Bouton "Faire une nouvelle recherche" → retour vers `/orientation/degree` (ne remet pas à zéro `initialUser`).

---

### Diagramme de flux complet

```
Landing Page — click "Trouver ma formation"
  │
  └─► /orientation/degree  (Étape 1 — 20%)
        Q: Quel diplôme souhaitez-vous préparer?
        [API: GET /api/degree?DegreeCyti=tous]
        │
        └─► /orientation/field  (Étape 2 — 50%)
              Q: Dans quelle filière?
              [API: GET /api/field?DomaineDegree={degree}]
              │
              └─► /orientation/city  (Étape 3 — 70%)
                    Q: Dans quelle ville?
                    [API: GET /api/partCyties?Degree={}&Domaine={}]
                    │
                    └─► /orientation/statuts  (Étape 4 — 85%)
                          Q: Je suis...?
                          [saveStatut() — 1ère écriture dans initialUser]
                          │
                          ├─ 'lycéen' ──────► /orientation/classe
                          │                     Q: En quelle classe?
                          │                     [saveClasse()] ──────────┐
                          │                                               │
                          ├─ 'étudiant' ────► /orientation/etudiant       │
                          │                     Q: Quel niveau actuel?    │
                          │                     [saveClasse()] ──────────┤
                          │                                               │
                          └─ autre ─────────► /orientation/dernierDiplome │
                                               Q: Dernier diplôme?       │
                                               [saveClasse()] ──────────┘
                                                                          │
                                               /orientation/contact  (Étape 6 — 95%)
                                               Q: Vos informations personnelles
                                               [saveContact() — complète initialUser]
                                               [POST /api/result — sauvegarde profil BDD]
                                                          │
                                               /orientation/resultats  (Étape 7 — 100%)
                                               [GET /api/result?city=&diplome=&domaine=&branche=]
                                               Affichage: liste de formations correspondantes
```

---

### Modèles de données impliqués

| Modèle | Fichier | Étape |
|---|---|---|
| `degree` | `model/degree-model.ts` | Étape 1 — options diplômes |
| `field` | `model/field-model.ts` | Étape 2 — options domaines |
| `ville` | `model/ville-model.ts` | Étape 3 — options villes |
| `UserProfil` | `model/user-profil-model.ts` | Objet accumulateur de tout le tunnel |
| `Contact` | `model/contact-model.ts` | Formulaire étape 6 |
| `interestelt` | `model/interest-item-model.ts` | Résultats étape 7 |

---

### Points d'attention techniques

| # | Problème | Impact |
|---|---|---|
| 1 | **Pas de persistance entre pages** — `initialUser` est en mémoire. Un refresh perd tout le tunnel | UX dégradée |
| 2 | **`initUser()` jamais appelée automatiquement** — une 2e recherche peut contenir des données de la 1re | Résultats erronés possibles |
| 3 | **Navigation non-linéaire** — le routing est conditionnel et basé sur les query params. Il est possible d'arriver à `/resultats` sans avoir complété toutes les étapes si `initialUser` a des champs vides | Résultats vides ou incorrects |
| 4 | **Aucune validation du profil avant envoi** — le POST `/api/result` est envoyé même si certains champs sont vides (city, degree, field) | Données clients incomplètes en BDD |
| 5 | **Bouton "retour navigateur"** — angular router ne synchronise pas l'état du service. Revenir en arrière dans le navigateur ne restaure pas les selections précédentes | Confusion UX |
| 6 | **`branche` non utilisée dans le filtre SQL** — le paramètre est transmis mais la `serch_result_procedure` ne l'utilise pas pour filtrer | Sur-résultats possibles |
