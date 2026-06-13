import { environment } from '../../environments/environment';

const base = environment.apiUrl;

export const API = {
  AUTH: {
    SIGNIN:   `${base}/api/auth/signin`,
    SIGNUP:   `${base}/api/auth/signup`,
    SIGNOUT:  `${base}/api/auth/signout`,
  },
  TEST: {
    ALL:   `${base}/api/test/all`,
    USER:  `${base}/api/test/user`,
    MOD:   `${base}/api/test/mod`,
    ADMIN: `${base}/api/test/admin`,
  },
  FORMATIONS: `${base}/api/formations`,
  UNIVERSITES: `${base}/api/universites`,
  ECOLES:      `${base}/api/ecoles`,
  CAMPUS:      `${base}/api/campus`,
  DIPLOMES:    `${base}/api/diplomes`,
  ACTUALITE: {
    BASE: `${base}/api/actualite`,
    SOME: `${base}/api/actualite/some`,
    BLOG: `${base}/api/actualite/blog`,
  },
  AVIS:       `${base}/api/avis`,
  ECOLE_AVIS: {
    BASE:   `${base}/api/ecoleavis`,
    NOTES:  `${base}/api/ecoleavis/notes`,
    SCHOOL: `${base}/api/ecoleavis/school`,
    CAMPUS: `${base}/api/ecoleavis/campus`,
    CURSUS: `${base}/api/ecoleavis/cursus`,
    DIPLO:  `${base}/api/ecoleavis/diplo`,
  },
  DOMAINE:      `${base}/api/domaine`,
  CATEG:        `${base}/api/categ`,
  CYTIES:       `${base}/api/cyties`,
  PART_CYTIES:  `${base}/api/partCyties`,
  FIELD:        `${base}/api/field`,
  DEGREE:       `${base}/api/degree`,
  RESULT:       `${base}/api/result`,
  ADVERS: {
    FORMATION:        `${base}/api/advers/formation`,
    FORMATION_SCHOOL: `${base}/api/advers/formationSchool`,
    DOMAINE:          `${base}/api/advers/domaine`,
    SCHOOL:           `${base}/api/advers/school`,
  },
  TOP_NEWS_SLIDE:  `${base}/api/topNewsSlide`,
  COUNT_FORMATION: `${base}/api/countFomration`,
  ETS:             `${base}/api/ets`,
  ADMIN_USERS:     `${base}/api/admin/users`,
  ADMIN_ADVISORS:  `${base}/api/admin/advisors`,
  ADVISOR: {
    SCHOOL: `${base}/api/advisor/school`,
    LEAD:   `${base}/api/advisor/lead`,
  },
} as const;
