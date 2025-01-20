import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { interestelt } from '../../../model/interest-item-model';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { OrientationService } from '../../orientation.service';


@Component({
  selector: 'app-resultats',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './resultats.component.html',
  styleUrl: './resultats.component.scss'
})


export class ResultatsComponent implements OnInit{
  
  school$!: Observable <interestelt[]>;
  loading$!: Observable<boolean>;

  constructor (private orientationService : OrientationService){}  
  
  ngOnInit(): void {
    this.loading$ = this.orientationService.loading$;
    this.orientationService.getSerchResult().subscribe()
    this.school$ = this.orientationService.school$ 
  }
}
