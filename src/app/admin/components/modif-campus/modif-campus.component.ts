import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, switchMap, take, tap } from 'rxjs';
import { Campus } from '../../models/campus.model';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-modif-campus',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './modif-campus.component.html',
  styleUrl: './modif-campus.component.scss'
})
export class ModifCampusComponent implements OnInit{

  modifCamp!: FormGroup;
  campus$!: Observable<Campus>;
  campPrev!: Campus;

  constructor ( private adminService : AdminService,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private appRout: Router) {}

  ngOnInit(): void {
    this.campus$ = this.route.params.pipe(
      switchMap(params => this.adminService.getCampusById(+params['id'])),
      take(1),
      tap(val => {
        this.modifCamp.patchValue({
            id_camp: val.id_camp,
            nom_camp: val.nom_camp,
            ville_cam: val.ville_cam,
            principal_camp: val.principal_camp,
            lon_camp: val.lon_camp,
            lat_camp: val.lat_camp,
            descriptif_camp: val.descriptif_camp,
          });
        console.log(val.nom_camp)
      })
    );

    this.modifCamp = this.formBuilder.group({
      id_camp: [null],
      nom_camp: [null],
      ville_cam: [null],
      principal_camp: [null],
      lon_camp: [null],
      lat_camp: [null],
      descriptif_camp: [null]
    });
  };

  onSubmitForm(){
    this.adminService.editCamp(this.modifCamp.value).subscribe();
    console.log(this.modifCamp.value)
    this.appRout.navigateByUrl('admin/adminStart');
  }

  onReturn(){
    this.appRout.navigateByUrl('admin/adminStart');
  }
}
