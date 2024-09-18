import { Component, OnInit } from '@angular/core';
import { HeadmsgComponent } from '../headmsg/headmsg.component';
import { start } from 'repl';
import { StartComponent } from '../start/start.component';
import { SharedComponentModule } from '../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { TopVideoSlideComponent } from '../top-video-slide/top-video-slide.component';
import { TopNewsSlideComponent } from '../top-news-slide/top-news-slide.component';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from 'ngx-fx-layout';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    SharedComponentModule,
    TopVideoSlideComponent,
    TopNewsSlideComponent,
    FlexLayoutModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {

  titre = "Comme Hassan, rentabilise ton avenir avec une bonne orientation.";
  soustitre = "... Le chômage est très souvent le résultat d'une mauvaise orientation.";
  photo = "./assets/images/home.webp";

  constructor( 
    private titleService:Title,
    private meta: Meta)
    {
      this.titleService.setTitle("Formations Professionnelles au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Trouvez le diplôme et l\'école de formation qui vous correspondent le mieux.' });
      this.meta.updateTag({ name: 'keywords', content: 'formation, professionnelle, ecoles, Cameroun, bts, licence, master' });
    }

  ngOnInit(){
    
  }
}
