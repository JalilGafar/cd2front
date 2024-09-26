import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-info-metier',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-metier.component.html',
  styleUrl: './info-metier.component.scss'
})
export class InfoMetierComponent implements OnInit{

  titre = "Un Métier qui te correspond";
  soustitre = "Comme Toumbe, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/pexels-cottonbro-studi.webp";

  constructor( 
    private appRout: Router,
    private titleService:Title) {this.titleService.setTitle("Les Métiers d'avenir | Camerdiplome");}

    trouverForm(){
      this.appRout.navigate(['./orientation/degree']);
    }

    

  ngOnInit(): void {
    
  }

}
