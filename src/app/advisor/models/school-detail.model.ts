// Ligne retournée par shoolData_procedure — une ligne par formation disponible.
// Les champs de l'école sont répétés sur chaque ligne.
export interface SchoolDetail {
  // Infos école (répétées sur chaque ligne)
  id_ecol:      number;
  nom_e:        string;
  sigle_e:      string;
  logo_e:       string;
  descriptif_e: string;
  tel_1_e:      string;
  email_e:      string;
  siteweb_e:    string;
  langue_e:     string;
  niveau_e:     string;

  // Campus
  ville_cam?: string;
  nom_camp?:  string;

  // Formation (une par ligne)
  nom_dip?:      string;
  nom_cat?:      string;
  nom_f?:        string;
  cout_f?:       number;
  duree_f?:      string;
  descriptif_f?: string;
  conditions_f?: string;
  nom_dom?:      string;
}

// Agrégat utilisé par SchoolPanelComponent
export interface SchoolPanelData {
  ecole:      SchoolDetail;    // première ligne = infos école communes
  formations: SchoolDetail[];  // toutes les lignes = une formation chacune
}
