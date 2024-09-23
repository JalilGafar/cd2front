import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable, switchMap, take, tap } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Universite } from '../../models/univ.model';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-modif-univ',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './modif-univ.component.html',
  styleUrl: './modif-univ.component.scss'
})
export class ModifUnivComponent implements OnInit{
  
  modifUniv!: FormGroup;
  universite$!: Observable<Universite>;
  univPrev!: Universite;
  text1: string = '<div>Hello World!</div><div>PrimeNG <b>Editor</b> Rocks</div><div><br></div>';

  constructor ( private adminService : AdminService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private appRout : Router) {}
  
  ngOnInit(): void {
    this.universite$ = this.route.params.pipe(
      switchMap(params => this.adminService.getUniversiteById(+params['id'])),
      take(1),
      tap(val => {
        this.modifUniv.patchValue({
            id_univ: val.id_univ,
            nom_univ: val.nom_univ,
            sigle_univ: val.sigle_univ,
            type_univ: val.type_univ,
            ville_univ: val.ville_univ,
            tel_univ: val.tel_univ,
            email_univ: val.email_univ,
            siteweb_univ: val.siteweb_univ,
            recteur_univ: val.recteur_univ,
            mot_du_recteur: val.mot_du_recteur,
            descriptif_univ: val.descriptif_univ,
          });
        console.log(val.nom_univ)
      })
    );

    this.modifUniv = this.formBuilder.group({
      id_univ: [null],
      nom_univ: [null],
      sigle_univ: [null],
      type_univ: [null],
      ville_univ: [null],
      tel_univ: [null],
      email_univ: [null],
      siteweb_univ: [null],
      recteur_univ: [null],
      mot_du_recteur: [null],
      descriptif_univ: [null],
    });
  }

  onSubmitForm(){
    this.adminService.editUniv(this.modifUniv.value).subscribe();
    console.log(this.modifUniv.value);
    this.appRout.navigateByUrl('admin/adminStart');
  }

  onReturn(){
    this.appRout.navigateByUrl('admin/adminStart');
  }




}
