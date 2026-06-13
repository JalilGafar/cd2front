export interface AdvisorLead {
  name:      string;
  surname:   string;
  tel:       string;
  email?:    string;
  statuts?:  string;
  level?:    string;
  bornDate?: string;
  country?:  string;
  city?:     string;
  degree?:   string;
  field?:    string;
}

export interface AdvisorLeadForm {
  name:    string;
  surname: string;
  tel:     string;
  email:   string;
  statuts: string;
  level:   string;
  city:    string;
  degree:  string;
  field:   string;
}
