import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { Formation } from '../../models/formation.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-formation',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-formation.component.html',
  styleUrl: './list-formation.component.scss'
})
export class ListFormationComponent implements OnInit{

  loading$!: Observable<boolean>;
  formations$!:Observable<Formation[]>;
  formations!: Formation[];

  constructor(private adminService: AdminService,
              private appRout : Router) { }
  
  ngOnInit(): void {
    this.InitObservable();
    this.adminService.getFormationsFromServer();
  }

  private InitObservable(){
    this.loading$ = this.adminService.loading$;
    this.formations$ = this.adminService.formation$;
  }

  onRowSelect(event:any){
    this.appRout.navigateByUrl('admin/formation/'+ event.data.id_form.toString());
  }

  onAddFormation(){
    this.appRout.navigateByUrl('admin/new-formation');
  }

}
