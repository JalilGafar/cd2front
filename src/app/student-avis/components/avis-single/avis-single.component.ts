import { Component, Input, OnInit } from '@angular/core';
import { Avis } from '../../../model/avis-model';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { EcoleAvis } from '../../../model/ecole-avis-model';

@Component({
  selector: 'app-avis-single',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './avis-single.component.html',
  styleUrl: './avis-single.component.scss'
})
export class AvisSingleComponent implements OnInit {

  @Input() avis!:Avis;
  @Input() schoolNote!:EcoleAvis;
  @Input() seemore: string = 'none';
  textMore : string = 'Lire la suite'

  ngOnInit(): void {
    
  }

  deroule(){
    console.log('ca clique !')
    if (this.seemore == 'none' ) {
      this.seemore = 'block';
      this.textMore = 'Fermer'
    } else {
      this.seemore = 'none';
      this.textMore = 'Lire la suite'
    }
  }

}
