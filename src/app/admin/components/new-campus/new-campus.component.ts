import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-new-campus',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './new-campus.component.html',
  styleUrl: './new-campus.component.scss'
})
export class NewCampusComponent implements OnInit {

  newCampus!: FormGroup;
  
  constructor(private formBuilder: FormBuilder,
              private adminService: AdminService,
              private appRout : Router){}

  ngOnInit(): void {
    this.newCampus = this.formBuilder.group({
      nom_camp : [null],
      ville_cam : [null],
      quartier_camp : [null],
      principal_camp : [null],
      descriptif_camp : [null],
      lon_camp : [null],
      lat_camp : [null],
    });
  }

  onSubmitForm(){
    console.log(this.newCampus.value);
    this.adminService.addNewCampus(this.newCampus.value).subscribe();
    this.appRout.navigateByUrl('admin/adminStart');
  }

}
