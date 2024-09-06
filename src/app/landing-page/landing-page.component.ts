import { Component, OnInit } from '@angular/core';
import { HeadmsgComponent } from '../headmsg/headmsg.component';
import { start } from 'repl';
import { StartComponent } from '../start/start.component';
import { SharedComponentModule } from '../shared/shared.modules';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [SharedComponentModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {

  titre = "Comme Hassan, rentabilise ton avenir avec une bonne orientation.";
  soustitre = "... Le chômage est très souvent le résultat d'une mauvaise orientation.";
  photo = "./assets/images/home.webp";

  ngOnInit(){
    
  }
}
