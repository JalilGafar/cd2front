import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { switchMap, tap } from 'rxjs';
import { Etablissement } from '../../../model/etablissement-model';
import { ActivatedRoute } from '@angular/router';
import { InfoServices } from '../../information.services';

@Component({
  selector: 'app-info-ecole-item',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './info-ecole-item.component.html',
  styleUrl: './info-ecole-item.component.scss'
})
export class InfoEcoleItemComponent implements OnInit{

  ecole!: Etablissement[];

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices
  ){}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.infoService.getEcoleById(+params['id'])),
      tap(metier=>this.ecole = metier)
    ).subscribe();
  }

}
