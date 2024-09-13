import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-info-hnd',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-hnd.component.html',
  styleUrl: './info-hnd.component.scss'
})
export class InfoHndComponent implements OnInit {

  titre = "Find your training";
  soustitre = "Like Stefi, 40% of high school graduates use Camerdiplome to find their school";
  photo = "./../../../../assets/images/pexels-godisable-jacob.webp";

  constructor( 
    private titleService:Title) {this.titleService.setTitle("The Higher National Diploma (HND)  in Cameroon  | Camerdiplome");}



  ngOnInit(): void {
    
  }

}
