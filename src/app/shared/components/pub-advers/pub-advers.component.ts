import { Component, Input, OnInit } from '@angular/core';
import { interestelt } from '../../../model/interest-item-model';
import { SharedComponentModule } from '../../shared.modules';
import { FormationAdvers } from '../../../model/formadv';
import { AdversService } from '../../../service/advers.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pub-advers',
  standalone: true,
  imports: [SharedComponentModule],
  templateUrl: './pub-advers.component.html',
  styleUrl: './pub-advers.component.scss'
})
export class PubAdversComponent implements OnInit {

  @Input() school!: FormationAdvers;

  constructor(
    private adversService: AdversService
  ){}

  ngOnInit(): void {
    // this.school = this.adversService.getFormationPub()
  }

  showFormation(){

  }

}
