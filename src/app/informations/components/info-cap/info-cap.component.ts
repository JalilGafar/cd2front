import { Component, OnInit } from '@angular/core';
import { HeadmsgComponent } from '../../../headmsg/headmsg.component';
import { StartComponent } from '../../../start/start.component';
import { PubFirstComponent } from '../../../shared/components/pub-first/pub-first.component';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-cap',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-cap.component.html',
  styleUrl: './info-cap.component.scss'
})
export class InfoCapComponent implements OnInit {

  titre = "Orientez vous vers un CAP";
  soustitre = "Comme Ngono, elles sont nombreuse à utiliser Camerdiplome pour trouver une formation";
  photo = "./../../assets/images/pexels-3.webp";

  ngOnInit(){
    
  } 

}
