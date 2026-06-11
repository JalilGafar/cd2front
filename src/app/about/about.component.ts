import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../service/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit, AfterViewInit {

  stats = [
    { value: 300, target: 200, suffix: '+', label: 'Établissements référencés' },
    { value: 800, target: 100, suffix: '+', label: 'Filières disponibles' },
    { value: 15, target: 8,   suffix: '',  label: 'Villes couvertes' },
    { value: 0, target: 0,   suffix: '',  label: 'Accès gratuit', isFree: true },
  ];

  team = [
    { name: 'Équipe Fondatrice',    role: 'Direction & Stratégie',          img: 'assets/images/about/team-founder.jpg' },
    { name: 'Conseillers d\'Orientation', role: 'Accompagnement étudiant',  img: 'assets/images/about/team-advisor.jpg' },
    { name: 'Équipe Technique',     role: 'Développement & Data',           img: 'assets/images/about/team-tech.jpg' },
  ];

  values = [
    { icon: 'bi-compass',         title: 'Orientation',    text: 'Guider chaque étudiant vers la filière qui correspond à son profil et à ses ambitions professionnelles.' },
    { icon: 'bi-transparency',    title: 'Transparence',   text: 'Fournir une information complète, impartiale et vérifiée sur chaque établissement et programme de formation.' },
    { icon: 'bi-people-fill',     title: 'Accessibilité',  text: 'Rendre l\'information académique accessible à tous, gratuitement, partout au Cameroun.' },
  ];

  steps = [
    { num: '01', icon: 'bi-search',            title: 'Explorez',   text: 'Parcourez les formations selon votre niveau, votre ville ou votre domaine d\'intérêt.' },
    { num: '02', icon: 'bi-bar-chart-line',     title: 'Comparez',   text: 'Consultez les fiches détaillées de chaque établissement : programmes, coûts, débouchés, avis d\'étudiants.' },
    { num: '03', icon: 'bi-person-check-fill',  title: 'Orientez-vous', text: 'Utilisez notre outil d\'orientation personnalisé pour trouver la formation qui vous correspond.' },
    { num: '04', icon: 'bi-rocket-takeoff',     title: 'Lancez-vous', text: 'Prenez contact avec l\'établissement de votre choix et démarrez votre parcours académique.' },
  ];

  constructor(
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seoService.setSeo({
      title:       'À propos de Camerdiplome | Orientation au Cameroun',
      description: "Camerdiplome est le spécialiste de l'orientation académique et professionnelle au Cameroun. Découvrez notre mission, notre équipe et nos valeurs.",
      url:         '/about',
      type:        'website'
    });
  }

  ngOnInit(): void {
    // this.orientationService.scrollTo('header', BEHAVIOR.auto);
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }



  ngAfterViewInit(): void {
    // this.orientationService.scrollTo('header', BEHAVIOR.auto);
    // if (isPlatformBrowser(this.platformId)) {
    //   this.initCounterObserver();
    // }
  }

  discover(): void {
    const msg = encodeURI('Je souhaite améliorer la visibilité de mon établissement sur Camerdiplome !');
    window.location.href = `https://wa.me/237679197112?text=${msg}`;
  }

  private initCounterObserver(): void {
    const section = document.querySelector('.stats-section');
    if (!section) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.animateCounters();
        observer.disconnect();
      }
    }, { threshold: 0.4 });

    observer.observe(section);
  }

  private animateCounters(): void {
    const duration = 1600;
    const steps = 60;
    const interval = duration / steps;

    this.stats.forEach(stat => {
      if (stat.isFree || stat.target === 0) return;
      let current = 0;
      const increment = stat.target / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stat.value = stat.target;
          clearInterval(timer);
        } else {
          stat.value = Math.floor(current);
        }
      }, interval);
    });
  }
}
