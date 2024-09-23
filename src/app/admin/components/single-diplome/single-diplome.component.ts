import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable, switchMap, tap } from 'rxjs';
import { Diplome } from '../../models/diplome.model';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-diplome',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './single-diplome.component.html',
  styleUrl: './single-diplome.component.scss'
})
export class SingleDiplomeComponent implements OnInit {

  loading$!: Observable<boolean>;
  diplome$!: Observable<Diplome>;
  diplome !: Diplome;

  constructor(private adminService : AdminService,
    private route: ActivatedRoute,
    private router: Router) { }

    ngOnInit(): void {
      this.initObservables ()
      
    }
  
    initObservables(){
      this.loading$ = this.adminService.loading$;
      this.diplome$ = this.route.params.pipe(
        switchMap(params => this.adminService.getDiplomeById(+params['id'])),
        tap(diplome=>this.diplome = diplome)
      );
     // this.adminService.universite$.pipe(
     //   //delay(1000),
     //   map(univs => univs.filter(univ => univ.id_univ === this.ecole.universites_id)[0]),
     //   tap(univ =>{ 
     //     this.universite = univ.nom_univ;
     //     console.log(this.universite)
     //   })
     // ).subscribe()
    }
  
    onModif(){
      this.router.navigateByUrl('admin/modif-diplome/'+ this.diplome.id_dip.toString())    
    }
  
    onDelet(){
      this.adminService.deletDiplomeById(this.diplome.id_dip).subscribe();
      this.router.navigateByUrl('/admin/adminStart')
    }
  
    onGoBack(){
      this.router.navigateByUrl('/admin/adminStart')
    }

}
