import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Universite } from '../../models/univ.model';
import { Observable } from 'rxjs';
import { Campus } from '../../models/campus.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-new-ecole',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-ecole.component.html',
  styleUrl: './new-ecole.component.scss'
})
export class NewEcoleComponent implements OnInit {

  newEcole!: FormGroup;
  universites!: Universite[];
  selectedUniv!: Universite;
  universites$!: Observable <Universite[]>;
  campus$!: Observable<Campus[]>

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newEcole = this.formBuilder.group({
      nom_e : [null],
      sigle_e : [null],
      logo_e : [null],
      niveau_e : [null],
      langue_e : [null],
      date_creation : [null],
      arrete_creation: [null],
      arrete_ouverture: [null],
      tel_1_e : [null],
      email_e : [null],
      siteweb_e : [null],
      bp_e : [null],
      directeur_e : [null],
      photo_directeur : [null],
      mot_directeur : [null],
      stat_e : [null],
      descriptif_e : [null],
      image_e : [null],
      universites_id : [null],
      campus_id : [null, [Validators.required]],
      campus_id1 : [null],
      campus_id2 : [null],
      campus_id3 : [null],
      campus_id4 : [null],
      campus_id5 : [null],
      campus_id6 : [null],
      campus_id7 : [null],
      campus_id8 : [null],
      campus_id9 : [null]
    });

    this.adminService.getUniversiteFromServer();
    this.universites$ = this.adminService.universite$;
    this.adminService.getCampusFromServer();
    this.campus$ = this.adminService.campus$;
  };

  onSubmitForm(){
    if (this.newEcole.invalid) {
      return;
    }
    this.adminService.addNewEcole(this.newEcole.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  };

  onReturn(){
    this.appRout.navigateByUrl('admin/adminStart');
  };

}
