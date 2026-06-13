export interface AdvisorSearchResult {
    id_form:      number;
    id_ecol:      number;
    nom_e:        string;
    sigle_e:      string;
    logo_e:       string | null;
    nom_dip:      string;
    nom_cat:      string;
    ville_cam:    string;
    duree_f:      string;
    cout_f:       number;
    descriptif_f: string;
    conditions_f: string;
    descriptif_e: string;
    tel_1_e:      string;
    email_e:      string;
    siteweb_e:    string;
}
