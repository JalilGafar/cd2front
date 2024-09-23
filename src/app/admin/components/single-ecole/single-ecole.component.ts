import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable, delay, map, switchMap, tap } from 'rxjs';
import { Ecole } from '../../models/ecole.model';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-ecole',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './single-ecole.component.html',
  styleUrl: './single-ecole.component.scss'
})
export class SingleEcoleComponent implements OnInit {

  loading$!: Observable<boolean>;
  ecole$!: Observable<Ecole>;
  ecole!: Ecole;
  universite!:string;

  constructor(private adminService : AdminService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.initObservables ()
    
  }

  initObservables(){
    this.loading$ = this.adminService.loading$;
    this.ecole$ = this.route.params.pipe(
      switchMap(params => this.adminService.getEcoleById(+params['id'])),
      tap(ecol=>this.ecole = ecol)
    );
    this.adminService.universite$.pipe(
      delay(1000),
      map(univs => univs.filter(univ => univ.id_univ === this.ecole.universites_id)[0]),
      tap(univ =>{ 
        this.universite = univ.nom_univ;
        console.log(this.universite)
      })
    ).subscribe()
  }

  onModif(){
    this.router.navigateByUrl('admin/modif-ecole/'+ this.ecole.id_ecol.toString())    
  }

  onDelet(){
    this.adminService.deletEcoleById(this.ecole.id_ecol).subscribe();
    this.router.navigateByUrl('/admin/adminStart')
  }

  onGoBack(){
    this.router.navigateByUrl('/admin/adminStart')
  }
}
