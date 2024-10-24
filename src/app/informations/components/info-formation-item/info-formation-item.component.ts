import { Component, OnInit } from '@angular/core';
import { Formation } from '../../../admin/models/formation.model';
import { ActivatedRoute } from '@angular/router';
import { InfoServices } from '../../information.services';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-info-formation-item',
  standalone: true,
  imports: [],
  templateUrl: './info-formation-item.component.html',
  styleUrl: './info-formation-item.component.scss'
})
export class InfoFormationItemComponent implements OnInit {

  formation!: Formation[];

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices
  ){}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.infoService.getFormationById(+params['id'])),
      tap(metier=>this.formation = metier)
    ).subscribe();
  }
}
