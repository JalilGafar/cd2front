import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categ } from '../../models/categ.model';
import { Observable } from 'rxjs';
import { Domaine } from '../../models/domaine.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-new-diplome',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-diplome.component.html',
  styleUrl: './new-diplome.component.scss'
})
export class NewDiplomeComponent implements OnInit {

  newDiplome!: FormGroup;
  categories!: Categ[];
  selectedCateg!: Categ;
  categorie$!: Observable <Categ[]>;
  domaine$!: Observable<Domaine[]>;

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newDiplome = this.formBuilder.group({
      id_dip: [null],
      nom_dip: [null],
      descriptif_dip: [null],
      niveau: [null],
      domaine_id: [null, [Validators.required]],
      domaine_id2: [null],
      domaine_id3: [null],
      categorie_id: [null]
    });

    this.adminService.getDomaineFromServer();
    this.domaine$ = this.adminService.domaine$;
    this.adminService.getCategFromServer();
    this.categorie$ = this.adminService.categ$;
  };

  onSubmitForm(){
    if (this.newDiplome.invalid) {
      return;
    }
    this.adminService.addNewDiplome(this.newDiplome.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  }

  onReturn(){
    this.appRout.navigateByUrl('admin/adminStart');
  }
}
