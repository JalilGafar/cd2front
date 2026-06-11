import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ecole } from '../../models/ecole.model';
import { Observable, map, take } from 'rxjs';
import { Diplome } from '../../models/diplome.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-new-formation',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-formation.component.html',
  styleUrl: './new-formation.component.scss'
})
export class NewFormationComponent implements OnInit, OnDestroy{

  newFormation!:FormGroup;
  ecole$!: Observable<Ecole[]>;
  diplomes$!: Observable<Diplome[]>;

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object){}


  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newFormation = this.formBuilder.group({
      id_form: [null],
      nom_f: [null],
      admission_diplome: [null],
      condition_diplome: [null],
      diplom_id: [null, [Validators.required]],
      ecole_id: [null, [Validators.required]],
      date_debut_f: [null],
      duree_f: [null],
      cout_f: [null],
      programme_f: [null],
      descriptif_f: [null],
    })

    this.adminService.getDiplomeFromServer();
    this.adminService.getEcoleFromServer();
    this.diplomes$ = this.adminService.diplomes$;
    this.ecole$ = this.adminService.ecoles$.pipe(
      map(data => data.map(data => ({
        ...data,
        displayName : data.sigle_e+' || '+data.nom_e
      })))
    ) ;
  }


  

  onSubmitForm(){
    if (this.newFormation.invalid) {
      return;
    }
    this.adminService.addNewFormation(this.newFormation.value).pipe(take(1)).subscribe();
    window.location.reload();
    //this.appRout.navigateByUrl('admin/new-formation');
  }

  ngOnDestroy() {
   // this.adminService.addNewFormation(this.newFormation.value).unsubscribe(); // Unsubscribe Observable 1
}
  onGoBack(){
    this.appRout.navigateByUrl('/admin/adminStart')
  }
}
