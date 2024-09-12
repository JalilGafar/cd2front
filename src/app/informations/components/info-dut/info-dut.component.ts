import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-info-dut',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './info-dut.component.html',
  styleUrl: './info-dut.component.scss'
})
export class InfoDutComponent implements OnInit {

  titre = "Trouvez votre formation";
  soustitre = "Comme Fatima, 40% des bacheliers utilisent Camerdiplome pour trouver leur école";
  photo = "./../../../../assets/images/fati_lon_mini.webp";


  ngOnInit(): void {
    
  }

}
