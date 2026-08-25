import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../service/seo.service';
import { WhatsappTrackingService } from '../service/whatsapp-tracking.service';

interface FaqItem {
  q: string;
  a: string;
  open: boolean;
}

interface FaqCategory {
  icon: string;
  label: string;
  items: FaqItem[];
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit, AfterViewInit {

  categories: FaqCategory[] = [
    {
      icon: 'bi-info-circle-fill',
      label: 'La plateforme',
      items: [
        {
          open: true,
          q: 'Qu\'est-ce que Camerdiplome ?',
          a: `Camerdiplome est le spécialiste de l'orientation académique et professionnelle au Cameroun.
              Que vous soyez collégien, lycéen, étudiant, en reconversion ou demandeur d'emploi,
              la plateforme vous aide à identifier la bonne formation, dans le bon établissement,
              pour le métier qui vous correspond.<br><br>
              Camerdiplome répond à des questions fondamentales :<br>
              <ul>
                <li>Quels sont les parcours de formation disponibles au Cameroun ?</li>
                <li>Quels métiers sont porteurs et résistants au chômage ?</li>
                <li>Quels établissements proposent la formation qui me correspond ?</li>
                <li>Quelle est la durée, le coût et les débouchés d'une filière ?</li>
              </ul>`
        },
        {
          open: false,
          q: 'L\'utilisation de Camerdiplome est-elle gratuite ?',
          a: `Oui, l'accès à la plateforme Camerdiplome est entièrement <strong>gratuit</strong> pour
              les élèves, étudiants et toute personne à la recherche d'orientation.<br><br>
              Vous pouvez librement consulter les fiches établissements, les formations,
              utiliser l'outil d'orientation personnalisé et prendre contact avec nos conseillers
              sans aucun frais.`
        },
        {
          open: false,
          q: 'Comment fonctionne l\'outil d\'orientation personnalisé ?',
          a: `Cliquez sur <strong>"Trouver ma formation"</strong> et répondez à quelques questions
              simples : votre ville, votre niveau d'études, le domaine qui vous intéresse.
              Notre algorithme vous propose ensuite les formations les mieux adaptées à votre profil.<br><br>
              Nos <strong>conseillers en stratégie d'études</strong> vous recontactent ensuite pour
              approfondir votre projet et vous mettre en relation avec les meilleurs établissements.`
        },
        {
          open: false,
          q: 'Les informations publiées sur Camerdiplome sont-elles fiables ?',
          a: `Nous nous engageons à ne publier que des informations vérifiées.
              Les données sur les établissements sont fournies directement par ces derniers
              et font l'objet d'une validation par notre équipe.<br><br>
              Certaines informations peuvent être absentes ou en cours de mise à jour en raison
              de la volumétrie importante des établissements et de leur répartition géographique.
              En cas de doute, notre équipe reste disponible pour vous renseigner.`
        },
      ]
    },
    {
      icon: 'bi-building-fill',
      label: 'Établissements',
      items: [
        {
          open: false,
          q: 'Comment référencer mon établissement sur Camerdiplome ?',
          a: `Vous êtes administrateur ou promoteur d'un établissement de formation ?
              Contactez-nous par téléphone ou WhatsApp au <strong>+237 6 79 19 71 12</strong>
              pour démarrer le processus d'inscription.<br><br>
              Notre équipe vous accompagnera pour créer et enrichir la fiche de votre établissement :
              programmes, formations, campus, galerie photos, conditions d'admission, etc.`
        },
        {
          open: false,
          q: 'Comment améliorer la visibilité de mon établissement sur la plateforme ?',
          a: `Plusieurs options sont disponibles pour mettre en avant votre établissement :
              <ul>
                <li>Compléter intégralement votre fiche établissement (formations, campus, photos)</li>
                <li>Encourager vos anciens étudiants à laisser des avis sur la plateforme</li>
                <li>Bénéficier de notre offre de mise en avant sponsorisée</li>
              </ul>
              Contactez-nous pour en savoir plus sur nos offres de visibilité.`
        },
        {
          open: false,
          q: 'Où sont situés les locaux de Camerdiplome ?',
          a: `Notre équipe est basée à <strong>Yaoundé</strong>, quartier Nkolbisson, carrefour Onana.<br><br>
              Vous pouvez également nous joindre à distance par téléphone, WhatsApp ou email
              — notre équipe répond généralement sous 24h.`
        },
      ]
    },
    {
      icon: 'bi-person-fill',
      label: 'Avis étudiants',
      items: [
        {
          open: false,
          q: 'Comment laisser un avis sur un établissement ?',
          a: `Rendez-vous dans la section <strong>"Avis étudiants"</strong> de la plateforme,
              sélectionnez l'établissement concerné et remplissez le formulaire d'évaluation.<br><br>
              Vos avis aident des milliers d'étudiants à mieux choisir leur école.
              Nous vous remercions pour votre contribution !`
        },
        {
          open: false,
          q: 'Les avis publiés sont-ils modérés ?',
          a: `Oui. Chaque avis soumis passe par une validation avant d'être publié
              afin de garantir des contenus respectueux et pertinents.<br><br>
              Nous travaillons activement à la mise à disposition d'un système d'avis
              de plus en plus impartial et représentatif de la réalité des établissements.`
        },
      ]
    },
  ];

  constructor(
    private seoService: SeoService,
    private whatsappTracking: WhatsappTrackingService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seoService.setSeo({
      title:       'FAQ — Questions fréquentes | Camerdiplome',
      description: "Toutes les réponses à vos questions sur Camerdiplome : fonctionnement de la plateforme, référencement des établissements, avis étudiants et orientation au Cameroun.",
      url:         '/faq',
      type:        'website'
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  ngAfterViewInit(): void {
    // this.orientationService.scrollTo('header', BEHAVIOR.auto);
  }

  toggle(item: FaqItem): void {
    item.open = !item.open;
  }

  discover(event?: Event): void {
    const msg = encodeURI('Je souhaite améliorer la visibilité de mon établissement sur Camerdiplome !');
    this.whatsappTracking.openWhatsapp(`https://wa.me/237676476096?text=${msg}`, event);
  }
}
