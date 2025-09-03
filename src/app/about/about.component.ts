import { Component, OnInit } from '@angular/core';
import { OrientationService } from '../orientation/orientation.service';
import { BEHAVIOR } from '../model/behavior';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {

  ecoles = [
    {
      "id_ecol": 3,
      "sigle_e": "UCAC-FSSG",
      "nom_e": "Faculté de Sciences Sociales et de Gestion"
    },
    {
      "id_ecol": 4,
      "sigle_e": "ISTDI",
      "nom_e": "Institut Supérieur de Technologies et du Design Industriel"
    },
    {
      "id_ecol": 5,
      "sigle_e": "ICIA",
      "nom_e": "Institut de Commerce et d’Ingénierie d’Affaires"
    },
    {
      "id_ecol": 6,
      "sigle_e": "3IAC",
      "nom_e": "Institut d’Ingénierie Informatique d’Afrique Centrale"
    },
    {
      "id_ecol": 7,
      "sigle_e": "PISTI",
      "nom_e": "Les Programmes Internationaux des Sciences et Technologies de l’Innovation"
    },
    {
      "id_ecol": 8,
      "sigle_e": "SEAS",
      "nom_e": "School of Engineering and Applied Sciences"
    },
    {
      "id_ecol": 17,
      "sigle_e": "FLSH",
      "nom_e": "Faculté des Lettres et Sciences Humaines de Dschang"
    },
    {
      "id_ecol": 18,
      "sigle_e": "FSEG",
      "nom_e": "Faculté des Sciences Economiques et de Gestion de Dschang"
    },
    {
      "id_ecol": 19,
      "sigle_e": "FSJP",
      "nom_e": "Faculté des Sciences Juridiques et Politiques de Dschang"
    },
    {
      "id_ecol": 20,
      "sigle_e": "FS",
      "nom_e": "Faculté des Sciences de Dschang"
    },
    {
      "id_ecol": 21,
      "sigle_e": "FASA",
      "nom_e": "Faculté d'Agronomie et des Sciences Agricoles de Dschang"
    },
    {
      "id_ecol": 22,
      "sigle_e": "IUT",
      "nom_e": "Institut Universitaire FOTSO Victor de Bandjoun"
    },
    {
      "id_ecol": 23,
      "sigle_e": "IBAF",
      "nom_e": "Institut des Beaux-Arts de Foumban"
    },
    {
      "id_ecol": 24,
      "sigle_e": "FMSP",
      "nom_e": "Faculté de Médecine et des Sciences Pharmaceutiques de Dschang"
    },
    {
      "id_ecol": 35,
      "sigle_e": "EGEM",
      "nom_e": "Ecole de Géologie et d'Exploitation Minière"
    },
    {
      "id_ecol": 37,
      "sigle_e": "INESSBIN",
      "nom_e": "Institut d’Emergence de la Santé et des Sciences Biomédicales de Ngaoundéré"
    },
    {
      "id_ecol": 38,
      "sigle_e": "FEMS",
      "nom_e": "Faculty of Economics and Management Science de Bamenda"
    },
    {
      "id_ecol": 39,
      "sigle_e": "FE",
      "nom_e": "Faculty of Education de Bamenda"
    },
    {
      "id_ecol": 40,
      "sigle_e": "ISSTMADD",
      "nom_e": "Institut Supérieur des Sciences, de Technologies ,de Management et Développement Durable"
    },
    {
      "id_ecol": 41,
      "sigle_e": "SISMA",
      "nom_e": "SANDA Institut Supérieur de Management"
    },
    {
      "id_ecol": 42,
      "sigle_e": "ISYD",
      "nom_e": "Institut Supérieur Yérima Dewa"
    },
    {
      "id_ecol": 43,
      "sigle_e": "ISFMB",
      "nom_e": "Institut Supérieur Fondation MAMADOU BAKO"
    },
    {
      "id_ecol": 46,
      "sigle_e": "ISSSPAM",
      "nom_e": "Institut Supérieur des Sciences de la Santé et du Para-Medical"
    },
    {
      "id_ecol": 47,
      "sigle_e": "ISSTY",
      "nom_e": "Institut Supérieur des Sciences et Techniques de Yaoundé"
    },
    {
      "id_ecol": 48,
      "sigle_e": "ISSEG",
      "nom_e": "Institut Supérieur des Sciences Économiques et de Gestion"
    },
    {
      "id_ecol": 49,
      "sigle_e": "CBHI",
      "nom_e": "Cameroon Bilingual Higher Institute"
    },
    {
      "id_ecol": 50,
      "sigle_e": "CIEPO",
      "nom_e": "Centre International des Etudes Polytechniques d’Obala"
    },
    {
      "id_ecol": 51,
      "sigle_e": "SUPDECO",
      "nom_e": "Ecole Supérieure de Commerce"
    },
    {
      "id_ecol": 52,
      "sigle_e": "PIGIER Cameroun",
      "nom_e": "PIGIER l'Ecole des Métiers de l'Entreprise"
    },
    {
      "id_ecol": 53,
      "sigle_e": "ESSFAR",
      "nom_e": "Ecole Supérieure des Sciences de la Finance, de l'Assurance et des Risque"
    },
    {
      "id_ecol": 54,
      "sigle_e": "ESSACA",
      "nom_e": "Ecole Supérieure Spéciale d’Architecture du Cameroun "
    },
    {
      "id_ecol": 55,
      "sigle_e": "YSCHOOL",
      "nom_e": "Ecole Internationale du Management et de l'Entrepreneuriat "
    },
    {
      "id_ecol": 56,
      "sigle_e": "GHI",
      "nom_e": "Glodnas Higher Institute"
    },
    {
      "id_ecol": 57,
      "sigle_e": "HEHIPEDS",
      "nom_e": "Heritage Higher Institute of Peace Development Studies"
    },
    {
      "id_ecol": 58,
      "sigle_e": "HIME",
      "nom_e": "Higher Institue of Management  and Entrepreneurship"
    },
    {
      "id_ecol": 59,
      "sigle_e": "HIHIHS",
      "nom_e": "Holy Infant Higher Institute of Health Sciences"
    },
    {
      "id_ecol": 60,
      "sigle_e": "UCAC-FSJP",
      "nom_e": "UCAC Faculté de sciences juridiques et politiques"
    },
    {
      "id_ecol": 61,
      "sigle_e": "UCAC-FT",
      "nom_e": "UCAC Faculté de Théologie "
    },
    {
      "id_ecol": 62,
      "sigle_e": "UCAC-FP",
      "nom_e": "UCAC Faculté de Philosophie "
    },
    {
      "id_ecol": 63,
      "sigle_e": "UCAC-DDC",
      "nom_e": "UCAC Département de Droit Canonique"
    },
    {
      "id_ecol": 64,
      "sigle_e": "UCAC-ICam",
      "nom_e": "Institut Ucac-Icam"
    },
    {
      "id_ecol": 65,
      "sigle_e": "UCAC-ESS",
      "nom_e": "UCAC Ecole des Science de la Santé"
    },
    {
      "id_ecol": 66,
      "sigle_e": "HE-GTD",
      "nom_e": "Institut des Haut Etudes sur la Gouvernance Territoriale et la Décentralisation"
    },
    {
      "id_ecol": 67,
      "sigle_e": "IHTM/ PIST",
      "nom_e": "Institut des Haut Technologies et de Management/ Panafrican Institute of Strategy and Technology"
    },
    {
      "id_ecol": 68,
      "sigle_e": "ISBAC",
      "nom_e": "Institut des Beaux-Arts Cheikh Anta Diop "
    },
    {
      "id_ecol": 69,
      "sigle_e": "ISEIG SUP",
      "nom_e": "Institut des Sciences Economiques et Informatiques de Gestion"
    },
    {
      "id_ecol": 70,
      "sigle_e": "IMS",
      "nom_e": "INSTITUT MBASSI SUPÉRIEUR"
    },
    {
      "id_ecol": 71,
      "sigle_e": "ISJ",
      "nom_e": "Institut Saint Jean"
    },
    {
      "id_ecol": 72,
      "sigle_e": "INSA",
      "nom_e": "Institut Supérieur Azimut"
    },
    {
      "id_ecol": 73,
      "sigle_e": "ISAPES",
      "nom_e": "Institut des Sciences Appliquées des Professions de l'Environnement et de la Santé"
    },
    {
      "id_ecol": 74,
      "sigle_e": "CITEC",
      "nom_e": "Higher Institute of Technology and Management"
    },
    {
      "id_ecol": 75,
      "sigle_e": "ISAGO",
      "nom_e": "Institut Supérieur d’Agriculture et de Gestion"
    },
    {
      "id_ecol": 76,
      "sigle_e": "ISSTAS",
      "nom_e": "Institut Supérieur des Sciences et Techniques Appliquées à la Santé"
    },
    {
      "id_ecol": 77,
      "sigle_e": "Access-HIPS",
      "nom_e": "Access Higher Institute of Professional Studies"
    },
    {
      "id_ecol": 78,
      "sigle_e": "ALPHA-HIBTS",
      "nom_e": "Alpha Higher Institute of Biomedical and Technological Sciences"
    },
    {
      "id_ecol": 79,
      "sigle_e": "BHIST",
      "nom_e": "British Higher Institute of Science and Technology"
    },
    {
      "id_ecol": 80,
      "sigle_e": "ESIAC",
      "nom_e": "Ecole Supérieure d’Ingénieurs d’Afrique Centrale"
    },
    {
      "id_ecol": 81,
      "sigle_e": "ESTLS",
      "nom_e": "Ecole Supérieure Technique la Salle"
    },
    {
      "id_ecol": 82,
      "sigle_e": "IPD-AC",
      "nom_e": "Institut Panafricain pour le Développement Région Afrique Centrale"
    },
    {
      "id_ecol": 83,
      "sigle_e": "IUE",
      "nom_e": "Institut Universitaire de l'Entrepreneuriat"
    },
    {
      "id_ecol": 84,
      "sigle_e": "ISATIC",
      "nom_e": "Institut Supérieur Africain des Technologies de l’Information et de la Connaissance"
    },
    {
      "id_ecol": 85,
      "sigle_e": "ISECMA",
      "nom_e": "Institut Supérieur d’Etudes Commerciales et de Management"
    },
    {
      "id_ecol": 86,
      "sigle_e": "IPTAM / CFPAM",
      "nom_e": "Institut Professionnel des Technologies, Arts et Métiers"
    },
    {
      "id_ecol": 87,
      "sigle_e": "ISCG",
      "nom_e": "Institut Supérieur de Chimie et de Gestion"
    },
    {
      "id_ecol": 88,
      "sigle_e": "ISGH-KGS",
      "nom_e": "Institut Supérieur de Gestion et d’Hôtellerie KELLA GAMO Sidonie "
    },
    {
      "id_ecol": 89,
      "sigle_e": "IUSTE",
      "nom_e": "Institut Universitaire des Sciences, des Technologies et de l’Ethique"
    },
    {
      "id_ecol": 90,
      "sigle_e": "ISKA",
      "nom_e": "Institut Supérieur Kalata International"
    },
    {
      "id_ecol": 91,
      "sigle_e": "ISPPA",
      "nom_e": "Institut Supérieur de Psychopédagogie Appliquée "
    },
    {
      "id_ecol": 92,
      "sigle_e": "PKFIE",
      "nom_e": "PKFokam Institute of Excellence"
    },
    {
      "id_ecol": 93,
      "sigle_e": "ISMAT",
      "nom_e": "Institut Universitaire Matamfen"
    },
    {
      "id_ecol": 94,
      "sigle_e": "ISESTMA",
      "nom_e": "Institut  Supérieur  d’Etudes  Scientifiques,  Technologiques  et  Managériales"
    },
    {
      "id_ecol": 95,
      "sigle_e": "I2MSUPDECO",
      "nom_e": "Institut de Management et de Marketing Supérieur de Commerce "
    },
    {
      "id_ecol": 96,
      "sigle_e": "ISMAM",
      "nom_e": "Institut Supérieur de Management de Manengouba"
    },
    {
      "id_ecol": 97,
      "sigle_e": "IME",
      "nom_e": "Institut Supérieur de Management et de l’Entrepreneuriat"
    },
    {
      "id_ecol": 98,
      "sigle_e": "ISMATA",
      "nom_e": "Institut Supérieur de Management et de Technologies Avancées "
    },
    {
      "id_ecol": 99,
      "sigle_e": "ICT",
      "nom_e": "Information and Communication Technology University Institute"
    },
    {
      "id_ecol": 100,
      "sigle_e": "ISGHO",
      "nom_e": "Institut Supérieur de Gestion et d’Hôtellerie"
    },
    {
      "id_ecol": 101,
      "sigle_e": "ISSER",
      "nom_e": "Institut Supérieur des Sciences et des Energies Renouvelables"
    },
    {
      "id_ecol": 102,
      "sigle_e": "RIIS",
      "nom_e": "Rapus International Institute School"
    },
    {
      "id_ecol": 103,
      "sigle_e": "ISMTI",
      "nom_e": "Institut Supérieur de Management et des Technologies Industrielles"
    },
    {
      "id_ecol": 104,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Medico Sanitaire"
    },
    {
      "id_ecol": 105,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Génie Electrique"
    },
    {
      "id_ecol": 106,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Génie Civil"
    },
    {
      "id_ecol": 107,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Génie Informatique"
    },
    {
      "id_ecol": 108,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté d'Agriculture"
    },
    {
      "id_ecol": 109,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Communication"
    },
    {
      "id_ecol": 110,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté Carrieres Juridiques"
    },
    {
      "id_ecol": 111,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculte Science of Education"
    },
    {
      "id_ecol": 112,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculté de Management"
    },
    {
      "id_ecol": 113,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculte Environmental Sciences"
    },
    {
      "id_ecol": 114,
      "sigle_e": "BCU",
      "nom_e": "BCU Faculty of Business and Finance"
    },
    {
      "id_ecol": 115,
      "sigle_e": "CIAF",
      "nom_e": "CIA Formation"
    },
    {
      "id_ecol": 116,
      "sigle_e": "ACERFIF",
      "nom_e": "ACERFI Formation"
    },
    {
      "id_ecol": 117,
      "sigle_e": "ISMI",
      "nom_e": "Institut Supérieur de Management International"
    },
    {
      "id_ecol": 118,
      "sigle_e": "ISPIM",
      "nom_e": "Institut Supérieur de Pétrochimie et d'Ingénierie Mathématique"
    },
    {
      "id_ecol": 119,
      "sigle_e": "ISTBER",
      "nom_e": "Institut Supérieur de Technologie le Bon Berger"
    },
    {
      "id_ecol": 120,
      "sigle_e": "ISTM",
      "nom_e": "Institut Supérieur de Technologie Médicale de Nkolodom"
    },
    {
      "id_ecol": 121,
      "sigle_e": "ISTIC",
      "nom_e": "Institut Supérieur de Traduction, d’Interprétariat et de Communication "
    },
    {
      "id_ecol": 122,
      "sigle_e": "ISA",
      "nom_e": "Institut Supérieur des Affaires"
    },
    {
      "id_ecol": 123,
      "sigle_e": "ISMND",
      "nom_e": "Institut Supérieur des Métiers Notre Dame"
    },
    {
      "id_ecol": 124,
      "sigle_e": "ISSAEER",
      "nom_e": "Institut Supérieur des Sciences Agronomiques, de l’Environnement et de l’Entrepreneuriat Rural"
    },
    {
      "id_ecol": 125,
      "sigle_e": "ISSBA",
      "nom_e": "Institut Supérieur des Sciences Biologiques et Appliquées"
    },
    {
      "id_ecol": 126,
      "sigle_e": "ISSE",
      "nom_e": "Institut Supérieur des Sciences de l’Entreprise"
    },
    {
      "id_ecol": 127,
      "sigle_e": "ISTECSM",
      "nom_e": "Institut Supérieur des Sciences et des Technologies Sainte Maria"
    },
    {
      "id_ecol": 128,
      "sigle_e": "ISSTS",
      "nom_e": "Institut Supérieur des Sciences et Technologies de la Santé"
    },
    {
      "id_ecol": 129,
      "sigle_e": "I2STS",
      "nom_e": "Institut Supérieur des Sciences et Technologies la Sapience"
    },
    {
      "id_ecol": 130,
      "sigle_e": "ISSAM",
      "nom_e": "Institut Supérieur des Sciences, Arts et Métiers"
    },
    {
      "id_ecol": 131,
      "sigle_e": "ISTAO",
      "nom_e": "Institut Supérieur des Techniques Agricoles d’Ombessa"
    },
    {
      "id_ecol": 132,
      "sigle_e": "ISPMS",
      "nom_e": "Institut Supérieur du Personnel Médico-Sanitaire"
    },
    {
      "id_ecol": 133,
      "sigle_e": "ISH",
      "nom_e": "Institut Supérieur Hintel"
    },
    {
      "id_ecol": 134,
      "sigle_e": "JIMITHI",
      "nom_e": "Jimit Hhigher Institute"
    },
    {
      "id_ecol": 135,
      "sigle_e": "ISR",
      "nom_e": "Institut Supérieur la Rosière"
    },
    {
      "id_ecol": 136,
      "sigle_e": "ISL",
      "nom_e": "Institut Supérieur Lead"
    },
    {
      "id_ecol": 137,
      "sigle_e": "ISP",
      "nom_e": "Institut Supérieur Polytechnique de Yaoundé"
    },
    {
      "id_ecol": 138,
      "sigle_e": "ISPA",
      "nom_e": "Institut Supérieur Polytechnique les Armandins"
    },
    {
      "id_ecol": 139,
      "sigle_e": "ISRD",
      "nom_e": "Institut Supérieur Royal Deumaga"
    },
    {
      "id_ecol": 140,
      "sigle_e": "ISSJP2",
      "nom_e": "Institut Supérieur Saint Jean-Paul II"
    },
    {
      "id_ecol": 141,
      "sigle_e": "INUCASTY",
      "nom_e": "Institut Universitaire Catholique Sainte Thérèse de Yaoundé"
    },
    {
      "id_ecol": 142,
      "sigle_e": "IUSM",
      "nom_e": "Institut Universitaire des Sciences et de Management"
    },
    {
      "id_ecol": 143,
      "sigle_e": "IUSPM",
      "nom_e": "Institut Universitaire des Sciences Pétrolières et de Magement"
    },
    {
      "id_ecol": 144,
      "sigle_e": "ISTAG",
      "nom_e": "Institut Supérieur de Technologie Appliquée et de Gestion"
    },
    {
      "id_ecol": 145,
      "sigle_e": "IUNP",
      "nom_e": "Institut Universitaire J. NDI SAMBA Polytech"
    },
    {
      "id_ecol": 146,
      "sigle_e": "IUNS",
      "nom_e": "Institut Universitaire J. Ndi Samba"
    },
    {
      "id_ecol": 147,
      "sigle_e": "ISPS",
      "nom_e": "Institut Supérieur des Professions de Santé"
    },
    {
      "id_ecol": 148,
      "sigle_e": "IUV",
      "nom_e": "Institut Universitaire La Vision"
    },
    {
      "id_ecol": 149,
      "sigle_e": "UPAC-FSS",
      "nom_e": "UPAC Faculté des Sciences de la Santé"
    },
    {
      "id_ecol": 150,
      "sigle_e": "UPAC-FTIC",
      "nom_e": "UPAC Faculté des Technologies de l'Information et de la Communication "
    },
    {
      "id_ecol": 151,
      "sigle_e": "UPAC-FSSRI",
      "nom_e": "UPAC-Faculté des Sciences Sociales et des Relations Internationales"
    },
    {
      "id_ecol": 152,
      "sigle_e": "UPAC-FTPSR",
      "nom_e": "UPAC Faculté de Theologie Protestante et des Sciences Religieuses"
    },
    {
      "id_ecol": 153,
      "sigle_e": "IUS",
      "nom_e": "Institut Universitaire SIANTOU"
    },
    {
      "id_ecol": 154,
      "sigle_e": "IUSBAA",
      "nom_e": "Institut Universitaire Sous-régional Bilingue Agenla Academy"
    },
    {
      "id_ecol": 155,
      "sigle_e": "IBAY-SUP",
      "nom_e": "International Bilingual Academy Yaoundé "
    },
    {
      "id_ecol": 156,
      "sigle_e": "INIESAT",
      "nom_e": "International Institute of Engineering Science, Arts and Technology"
    },
    {
      "id_ecol": 157,
      "sigle_e": "KEBHIPS",
      "nom_e": "Kelden Bilingual Higher Institute of Professional Studies"
    },
    {
      "id_ecol": 158,
      "sigle_e": "MPHIY",
      "nom_e": "Millenium Polytechnic Higher Institute"
    },
    {
      "id_ecol": 159,
      "sigle_e": "PV",
      "nom_e": "Prépa Vogt"
    },
    {
      "id_ecol": 160,
      "sigle_e": "UAC",
      "nom_e": "Université Adventiste Cosendai"
    },
    {
      "id_ecol": 161,
      "sigle_e": "YIBS",
      "nom_e": "Yaoundé International Business School"
    },
    {
      "id_ecol": 162,
      "sigle_e": "YSEM",
      "nom_e": "Yaounde School of Economics and Management"
    },
    {
      "id_ecol": 163,
      "sigle_e": "DIT",
      "nom_e": "Douala Institute of Technology"
    },
    {
      "id_ecol": 164,
      "sigle_e": "PIGIER",
      "nom_e": "Ecole Supérieure de Commerce et de Management PIGIER Cameroun"
    },
    {
      "id_ecol": 165,
      "sigle_e": "ESSET",
      "nom_e": "Ecole Supérieure des Sciences et Techniques"
    },
    {
      "id_ecol": 166,
      "sigle_e": "HINTP",
      "nom_e": "Higher Institute for Nursing and Technico-Sanitary Personals"
    },
    {
      "id_ecol": 167,
      "sigle_e": "HIB",
      "nom_e": "Higher Institute of Business"
    },
    {
      "id_ecol": 168,
      "sigle_e": "HIPE",
      "nom_e": "Higher Institute of Professional Excellence"
    },
    {
      "id_ecol": 169,
      "sigle_e": "ISDK",
      "nom_e": "Institut Supérieur Dale Kietzman"
    },
    {
      "id_ecol": 170,
      "sigle_e": "ISCAC",
      "nom_e": "Institut Supérieur de Commerce et d’Administration des Collectivités"
    },
    {
      "id_ecol": 171,
      "sigle_e": "ISCOM",
      "nom_e": "Institut Supérieur de Commerce et de management"
    },
    {
      "id_ecol": 172,
      "sigle_e": "ISG",
      "nom_e": "Institut Supérieur de Gestion"
    },
    {
      "id_ecol": 173,
      "sigle_e": "ISGD",
      "nom_e": "Institut Supérieur de Gestion et du Design"
    },
    {
      "id_ecol": 174,
      "sigle_e": "IUL",
      "nom_e": "Institut Universitaire des Leaders"
    },
    {
      "id_ecol": 176,
      "sigle_e": "ISMA",
      "nom_e": "Institut Supérieur de Management"
    },
    {
      "id_ecol": 177,
      "sigle_e": "ISTAMA",
      "nom_e": " Institut Supérieur de Technologie Avancée et du Management"
    },
    {
      "id_ecol": 178,
      "sigle_e": "ISTG",
      "nom_e": "Institut Supérieur de Technologie et de Gestion"
    },
    {
      "id_ecol": 179,
      "sigle_e": "ISTG-AC",
      "nom_e": "Institut Supérieur de Technologie et de Gestion d’Afrique Centrale (Institut Maaron)"
    },
    {
      "id_ecol": 180,
      "sigle_e": "ISTTAM",
      "nom_e": "Institut Supérieur de Transport, de Tourisme, des Affaires et de Management"
    },
    {
      "id_ecol": 181,
      "sigle_e": "ISFA",
      "nom_e": "Institut Supérieur des Formations Appliquées"
    },
    {
      "id_ecol": 182,
      "sigle_e": "ODECI",
      "nom_e": "Organisation pour le Developpement des Echanges et du Commerce International"
    },
    {
      "id_ecol": 183,
      "sigle_e": "SIGMEN",
      "nom_e": "Institut Supérieur des Hautes Etudes Commerciales et Industrielles"
    },
    {
      "id_ecol": 184,
      "sigle_e": "ISSTECO",
      "nom_e": "Institut Supérieur des Sciences, de Technologie et de Commerce"
    },
    {
      "id_ecol": 185,
      "sigle_e": "ISTEC",
      "nom_e": "Institut Supérieur des Techniques Economiques et Comptables"
    },
    {
      "id_ecol": 186,
      "sigle_e": "ISGTE",
      "nom_e": "Institut Supérieur du Génie Thermique et Énergétique"
    },
    {
      "id_ecol": 187,
      "sigle_e": "ISTHAC",
      "nom_e": "Institut Supérieur du Tourisme, de l’Hôtellerie et des Arts Culinaires"
    },
    {
      "id_ecol": 188,
      "sigle_e": "ISETAG",
      "nom_e": "Institut Supérieur Évangélique des Technologies Appliquées et de Gestion"
    },
    {
      "id_ecol": 189,
      "sigle_e": "ISLAPE",
      "nom_e": "Institut Supérieur la Perle"
    },
    {
      "id_ecol": 190,
      "sigle_e": "ISPR",
      "nom_e": "Institut Supérieur Professeurs Réunis"
    },
    {
      "id_ecol": 191,
      "sigle_e": "ISICO",
      "nom_e": "Institut Supérieure d’Informatique et de Commerce"
    },
    {
      "id_ecol": 192,
      "sigle_e": "IUCSJD",
      "nom_e": "Institut Universitaire Catholique de Douala Saint Jérôme"
    },
    {
      "id_ecol": 193,
      "sigle_e": "IUC",
      "nom_e": "Institut Universitaire de la Côte"
    },
    {
      "id_ecol": 194,
      "sigle_e": "IUGET",
      "nom_e": "Institut Universitaire des Grandes Ecoles des Tropiques"
    },
    {
      "id_ecol": 195,
      "sigle_e": "IUES",
      "nom_e": "Institut Universitaire de l’Estuaire"
    },
    {
      "id_ecol": 196,
      "sigle_e": "IUG",
      "nom_e": "Institut Universitaire du Golfe de Guinée"
    },
    {
      "id_ecol": 197,
      "sigle_e": "PIST",
      "nom_e": "Panafrican Institute of Strategy and Technology"
    },
    {
      "id_ecol": 198,
      "sigle_e": "SFAA",
      "nom_e": "Sabena Flight Academy Africa"
    },
    {
      "id_ecol": 199,
      "sigle_e": "SLHIET",
      "nom_e": "Saint Louis Higher University Institute"
    },
    {
      "id_ecol": 200,
      "sigle_e": "SHHIEB",
      "nom_e": "Sky High Higher Institute of Engineering and Business"
    },
    {
      "id_ecol": 201,
      "sigle_e": "ISSTSM",
      "nom_e": "Institut Supérieur des Sciences et Techniques de la Santé et de Management"
    },
    {
      "id_ecol": 202,
      "sigle_e": "ISIC",
      "nom_e": "Institut Supérieur Industriel et Commercial de Garoua"
    },
    {
      "id_ecol": 203,
      "sigle_e": "ISSEG",
      "nom_e": "Institut Supérieur Septentrion de Garoua"
    },
    {
      "id_ecol": 204,
      "sigle_e": "IFPES",
      "nom_e": "Institut de Formation Professionnelle les Etoiles du Septentrion"
    },
    {
      "id_ecol": 205,
      "sigle_e": "BUST",
      "nom_e": "Bamenda University of Science and Technology"
    },
    {
      "id_ecol": 206,
      "sigle_e": "CHIHSBT",
      "nom_e": "Capitol Higher Institute of Health Sciences and Beauty Therapy"
    },
    {
      "id_ecol": 207,
      "sigle_e": "CSHSS",
      "nom_e": "Catholic School of Health Sciences Shisong"
    },
    {
      "id_ecol": 208,
      "sigle_e": "CATUC",
      "nom_e": "Catholic University Institute of Bamenda"
    }
  ]

  filiere = [
    {
      "id_dom": 111,
      "nom_dom": "Electromécanique",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 141,
      "nom_dom": "infirmerie",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 151,
      "nom_dom": "Medico-social",
      "branche_dom": "Sport, social, animation",
      "illustra_dom": null
    },
    {
      "id_dom": 137,
      "nom_dom": "édition",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 11,
      "nom_dom": "Environnement",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 157,
      "nom_dom": "eau",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 159,
      "nom_dom": "administration publique",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 114,
      "nom_dom": "Arabe",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 97,
      "nom_dom": "Automatisme",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 103,
      "nom_dom": "électronique",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 81,
      "nom_dom": "Audiovisuel",
      "branche_dom": "Image, son, animation 2D/3D",
      "illustra_dom": null
    },
    {
      "id_dom": 150,
      "nom_dom": "Véterinaire",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 144,
      "nom_dom": "nutrition",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 90,
      "nom_dom": "informatique",
      "branche_dom": "Informatique",
      "illustra_dom": "informatique.webp"
    },
    {
      "id_dom": 31,
      "nom_dom": "Collectivité Territoriale",
      "branche_dom": "Fonction publique",
      "illustra_dom": null
    },
    {
      "id_dom": 61,
      "nom_dom": "fiscalité",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 62,
      "nom_dom": "juridique",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 68,
      "nom_dom": "audit et contrôle",
      "branche_dom": "Finance, comptabilité",
      "illustra_dom": null
    },
    {
      "id_dom": 118,
      "nom_dom": "espagnole",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 38,
      "nom_dom": "esthétique et cosmétique",
      "branche_dom": "Bien-être, Beauté",
      "illustra_dom": null
    },
    {
      "id_dom": 155,
      "nom_dom": "sport",
      "branche_dom": "Sport, social, animation",
      "illustra_dom": null
    },
    {
      "id_dom": 126,
      "nom_dom": "philosophie",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 82,
      "nom_dom": "cinéma",
      "branche_dom": "Image, son, animation 2D/3D",
      "illustra_dom": null
    },
    {
      "id_dom": 135,
      "nom_dom": "publicité",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 15,
      "nom_dom": "Architecture",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 130,
      "nom_dom": "digital",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 14,
      "nom_dom": "Urbanisme",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 127,
      "nom_dom": "psychologie",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 125,
      "nom_dom": "linguistique",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 3,
      "nom_dom": "Agroalimentaire",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 2,
      "nom_dom": "Agronomie",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 56,
      "nom_dom": "ressources humaines",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 47,
      "nom_dom": "commerce",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 117,
      "nom_dom": "éducation",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 115,
      "nom_dom": "chinois",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 25,
      "nom_dom": "Design, Graphisme dessin",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 46,
      "nom_dom": "Administration des entreprises",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 67,
      "nom_dom": "Assurance",
      "branche_dom": "Finance, comptabilité",
      "illustra_dom": "Assurance.webp"
    },
    {
      "id_dom": 142,
      "nom_dom": "kinésiethérapie",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 146,
      "nom_dom": "paramédical",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 74,
      "nom_dom": "concour fonction publique",
      "branche_dom": "Fonction publique",
      "illustra_dom": null
    },
    {
      "id_dom": 59,
      "nom_dom": "vente",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 120,
      "nom_dom": "géorgaphie",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 92,
      "nom_dom": "Maintenance informatique",
      "branche_dom": "Informatique",
      "illustra_dom": null
    },
    {
      "id_dom": 79,
      "nom_dom": "restauration",
      "branche_dom": "Hôtellerie, tourisme",
      "illustra_dom": null
    },
    {
      "id_dom": 1,
      "nom_dom": "Agricole",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": "agricole.jpg"
    },
    {
      "id_dom": 124,
      "nom_dom": "langues étrangères",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 22,
      "nom_dom": "Culture",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 64,
      "nom_dom": "relations internationales",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 16,
      "nom_dom": "Art",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 94,
      "nom_dom": "système d'information",
      "branche_dom": "Informatique",
      "illustra_dom": null
    },
    {
      "id_dom": 33,
      "nom_dom": "Mode",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 72,
      "nom_dom": "finance",
      "branche_dom": "Finance, comptabilité",
      "illustra_dom": null
    },
    {
      "id_dom": 129,
      "nom_dom": "Communication",
      "branche_dom": "Marketing, communication",
      "illustra_dom": "communication.webp"
    },
    {
      "id_dom": 108,
      "nom_dom": "Mécanique",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 158,
      "nom_dom": "mine et pétrole",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 80,
      "nom_dom": "tourisme",
      "branche_dom": "Hôtellerie, tourisme",
      "illustra_dom": null
    },
    {
      "id_dom": 110,
      "nom_dom": "Sciences de la terre",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 134,
      "nom_dom": "médias",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 116,
      "nom_dom": "economie",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 122,
      "nom_dom": "italien",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 161,
      "nom_dom": "génie rural",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 107,
      "nom_dom": "Ingénieur",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 53,
      "nom_dom": "logistique",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 10,
      "nom_dom": "Energie",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 65,
      "nom_dom": "sciences politiques",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 93,
      "nom_dom": "programmation informatique",
      "branche_dom": "Informatique",
      "illustra_dom": null
    },
    {
      "id_dom": 147,
      "nom_dom": "pharmacie",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 8,
      "nom_dom": "Développement durable",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 149,
      "nom_dom": "Sage femme",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 163,
      "nom_dom": "Lettre",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 139,
      "nom_dom": "Biomédical",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 27,
      "nom_dom": "Décoration",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 50,
      "nom_dom": "entrepreneuriat",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 123,
      "nom_dom": "langue des signes",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 96,
      "nom_dom": "télécommunication",
      "branche_dom": "Informatique",
      "illustra_dom": "telecommunication.webp"
    },
    {
      "id_dom": 95,
      "nom_dom": "Système, réseaux et sécurité",
      "branche_dom": "Informatique",
      "illustra_dom": null
    },
    {
      "id_dom": 76,
      "nom_dom": "hôtellerie",
      "branche_dom": "Hôtellerie, tourisme",
      "illustra_dom": null
    },
    {
      "id_dom": 104,
      "nom_dom": "génie civil",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 162,
      "nom_dom": "génie thermique",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 100,
      "nom_dom": "Batiments et traveaux publiques",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 143,
      "nom_dom": "médecin",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 102,
      "nom_dom": "electricité",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 128,
      "nom_dom": "Théologie",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 105,
      "nom_dom": "génie industriel",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 58,
      "nom_dom": "transport",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 113,
      "nom_dom": "Anglais",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 132,
      "nom_dom": "Journalisme",
      "branche_dom": "Marketing, communication",
      "illustra_dom": "journalisme.webp"
    },
    {
      "id_dom": 12,
      "nom_dom": "bois",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 101,
      "nom_dom": "chimie",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 133,
      "nom_dom": "marketing",
      "branche_dom": "Marketing, communication",
      "illustra_dom": "marketing.webp"
    },
    {
      "id_dom": 34,
      "nom_dom": "Musique",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 154,
      "nom_dom": "social",
      "branche_dom": "Sport, social, animation",
      "illustra_dom": null
    },
    {
      "id_dom": 23,
      "nom_dom": "Danse",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 73,
      "nom_dom": "concours de l'armé",
      "branche_dom": "Fonction publique",
      "illustra_dom": null
    },
    {
      "id_dom": 136,
      "nom_dom": "web design",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 112,
      "nom_dom": "Allemend",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 145,
      "nom_dom": "Optique",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 109,
      "nom_dom": "Mécanique automobile",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 153,
      "nom_dom": "Science de la santé",
      "branche_dom": "santé",
      "illustra_dom": "sante.webp"
    },
    {
      "id_dom": 30,
      "nom_dom": "Infographie",
      "branche_dom": "Art, Culture, Design, Mode",
      "illustra_dom": null
    },
    {
      "id_dom": 88,
      "nom_dom": "base de donnée",
      "branche_dom": "Informatique",
      "illustra_dom": null
    },
    {
      "id_dom": 99,
      "nom_dom": "Biologie",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 43,
      "nom_dom": "naturopathie",
      "branche_dom": "Bien-être, Beauté",
      "illustra_dom": null
    },
    {
      "id_dom": 70,
      "nom_dom": "comptabilité",
      "branche_dom": "Finance, comptabilité",
      "illustra_dom": null
    },
    {
      "id_dom": 9,
      "nom_dom": "Elevage",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 77,
      "nom_dom": "cuisine et boulangerie",
      "branche_dom": "Hôtellerie, tourisme",
      "illustra_dom": null
    },
    {
      "id_dom": 51,
      "nom_dom": "Science de gestion",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 60,
      "nom_dom": "Droit",
      "branche_dom": "Droit, Sc. Politiques",
      "illustra_dom": null
    },
    {
      "id_dom": 69,
      "nom_dom": "banque",
      "branche_dom": "Finance, comptabilité",
      "illustra_dom": "banque.webp"
    },
    {
      "id_dom": 39,
      "nom_dom": "diététique",
      "branche_dom": "Bien-être, Beauté",
      "illustra_dom": null
    },
    {
      "id_dom": 131,
      "nom_dom": "événementiel",
      "branche_dom": "Marketing, communication",
      "illustra_dom": null
    },
    {
      "id_dom": 121,
      "nom_dom": "histoire",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    },
    {
      "id_dom": 160,
      "nom_dom": "foresterie",
      "branche_dom": "Agriculture, Environnement",
      "illustra_dom": null
    },
    {
      "id_dom": 138,
      "nom_dom": "Aide soignant",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 164,
      "nom_dom": "Mathématiques et Physiques",
      "branche_dom": "Ingénierie, Science",
      "illustra_dom": null
    },
    {
      "id_dom": 140,
      "nom_dom": "dentaire",
      "branche_dom": "santé",
      "illustra_dom": null
    },
    {
      "id_dom": 156,
      "nom_dom": "animation",
      "branche_dom": "Sport, social, animation",
      "illustra_dom": null
    },
    {
      "id_dom": 54,
      "nom_dom": "management",
      "branche_dom": "Commerce, management",
      "illustra_dom": null
    },
    {
      "id_dom": 119,
      "nom_dom": "français",
      "branche_dom": "Langues et Sc. humaines",
      "illustra_dom": null
    }
  ]

  constructor(private orientationService: OrientationService) { }

  discover() {
    let c = encodeURI('Je souhaite améliorer la visibilité de mon établissement sur Camerdiplome !');
    let url = `https://wa.me/237679197112?text=${c}`
    window.location.href = url;
  }

  ngOnInit(): void {

    // const routes = this.ecoles.map(ecoles => {
    //   const name = `${ecoles.sigle_e} ${ecoles.nom_e} ${ecoles.id_ecol}`;
    //   const slug = this.generateSlug(name);
    //   //return `/info/ecole/${slug}/${ecoles.id_ecol}`;
    //   return `
    //   <url>
    //     <loc>https://camerdiplome.com/info/ecole/${slug}/${ecoles.id_ecol}</loc>
    //     <lastmod>2025-08-06</lastmod>
    //     <changefreq>monthly</changefreq>
    //     <priority>0.9</priority>
    //   </url>
    //   `

    // });

    // console.log(routes)



    /*
    const filieres = this.filiere.map(filierer => {
      const name = `formations en ${filierer.nom_dom} au cameroun`;
      const slug = this.generateSlug(name);
      //  return `/info/domaine/${slug}/${filierer.id_dom}`;
      return `
        <url>
          <loc>https://camerdiplome.com/info/domaine/${slug}/${filierer.id_dom}</loc>
          <lastmod>2025-08-06</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.9</priority>
        </url>
      `

    });

    console.log(filieres)

  const filieres = this.filiere.map(filierer => {
    const name = `formations en ${filierer.nom_dom} au cameroun`;
    const slug = this.generateSlug(name);
    return `
    <url>
       <loc>https://camerphone.com/phones/phoneDetail/${slug}/${phone.id_phone}</loc>
       <lastmod>2025-08-06</lastmod>
       <changefreq>monthly</changefreq>
       <priority>0.9</priority>
     </url>
    `;

  });

  console.log(routes)

  */

  }

  generateSlug(str: string) {
    return str
      .normalize('NFD')                   // décompose les lettres accentuées
      .replace(/[\u0300-\u036f]/g, '')    // supprime les signes diacritiques (accents)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')        // remplace les caractères spéciaux par des -
      .replace(/^-+|-+$/g, '');           // enlève les - au début et à la fin
  }

  ngAfterViewInit(): void {
    this.orientationService.scrollTo('header', BEHAVIOR.auto)
  }

}
