import { Component, OnInit } from '@angular/core';
import { HeadmsgComponent } from '../headmsg/headmsg.component';
import { start } from 'repl';
import { StartComponent } from '../start/start.component';
import { SharedComponentModule } from '../shared/shared.modules';
import { Meta, Title } from '@angular/platform-browser';
import { TopVideoSlideComponent } from '../top-video-slide/top-video-slide.component';
import { TopNewsSlideComponent } from '../top-news-slide/top-news-slide.component';
import { CommonModule } from '@angular/common';
// import { FlexLayoutModule } from 'ngx-fx-layout';
import { TopNewsService } from '../service/top-news.service';
import { map, Observable } from 'rxjs';
import { ActuListComponent } from '../actualite/components/actu-list/actu-list.component';
import { SpinerService } from '../service/spiner.service';
import { SchoolAdvers } from '../model/school-adv';
import { SchoolAdversComponent } from '../shared/components/school-advers/school-advers.component';
import { AdversService } from '../service/advers.service';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    ActuListComponent,
    SharedComponentModule,
    // TopVideoSlideComponent,
    //  TopNewsSlideComponent,
    SchoolAdversComponent,
    // FlexLayoutModule,
    CommonModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent implements OnInit {

  titre = "Comme Hassan, rentabilise ton avenir avec une bonne orientation.";
  soustitre = "... Le chômage est très souvent le résultat d'une mauvaise orientation.";
  photo = "./assets/images/home.webp";
  loading$!: Observable<boolean>;

  schoolAdvers$!: Observable<SchoolAdvers[]>

  count!: number;
  // counter = document.querySelector('.counter');
   counti = 0 ;
   speed = 200; // The lower the slower

  constructor( 
    private loadingService: SpinerService,
    private service:TopNewsService,
    private adversService: AdversService,
    private titleService:Title,
    private meta: Meta)
    {
      this.titleService.setTitle("Formations Professionnelles au Cameroun | Camerdiplome");
      this.meta.updateTag({ name: 'description', content: 'Trouvez le diplôme et l\'école de formation qui vous correspondent le mieux.' });
      this.meta.updateTag({ name: 'keywords', content: 'formation, professionnelle, ecoles, Cameroun, bts, licence, master' });
    }

  ngOnInit(){
    this.schoolAdvers$ = this.adversService.getSchoolPub();
    this.service.countFormation().pipe(
      map(data => {
        this.count = data[0].cont;
        //this.updateCount(this.count, this.counti, this.speed)
        const updateCounto = () =>{
          const target = +this.count;
          const counta = +this.counti 
          const inc = target / this.speed;
          if (counta < target) {
            // Add inc to count and output in counter
            //console.log(counta +' Je SUIS '+ target)
            this.counti = ~~ (counta + inc);
            // Call function every ms
            setTimeout(updateCounto, 1);
          } else {
            this.counti = target;
          }
        }
        updateCounto()
      })        
    ).subscribe();
  }

  onLoadCourses() {
    try {
      this.loadingService.loadingOn();
      console.log('lllllllllllllll')
      // load courses from backend
    } catch (error) {
      // handle error message
    } finally {
      console.log('oooooooooooooo')
      this.loadingService.loadingOff();
    }
  }
}
