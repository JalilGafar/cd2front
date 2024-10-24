import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { Metier } from '../../../model/metier';
import { InfoServices } from '../../information.services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-info-metier-item',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './info-metier-item.component.html',
  styleUrl: './info-metier-item.component.scss'
})
export class InfoMetierItemComponent implements OnInit {

  metier$!: Observable<Metier>;
  metier!: Metier[];

  constructor(
    private route: ActivatedRoute,
    private infoService: InfoServices
  ){}

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(params => this.infoService.getMetierById(+params['id'])),
      tap(metier=>this.metier = metier)
    ).subscribe();
  }

}
