import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-new-univ',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-univ.component.html',
  styleUrl: './new-univ.component.scss'
})
export class NewUnivComponent implements OnInit{
  
  newUniv!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object){}
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.newUniv = this.formBuilder.group({
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
    })
  }

  onSubmitForm() {
   // console.log(this.newUniv.value);
    this.adminService.addNewUniv(this.newUniv.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
}

}
