import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Diplome } from '../../models/diplome.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-diplome',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-diplome.component.html',
  styleUrl: './list-diplome.component.scss'
})
export class ListDiplomeComponent implements OnInit{

  loading$!: Observable<boolean>;
  diplomes$!: Observable<Diplome[]>;

  constructor(private adminService: AdminService,
              private appRout : Router) { }
              
  ngOnInit(): void {
    this.InitObservable();
    this.adminService.getDiplomeFromServer();
  }

  private InitObservable(){
    this.loading$ = this.adminService.loading$;
    this.diplomes$ = this.adminService.diplomes$;
  }

  onRowSelect(event:any){
    this.appRout.navigateByUrl('admin/diplome/'+ event.data.id_dip.toString());
  }

  onAdddiplome(){
    this.appRout.navigateByUrl('admin/new-diplome');
  }

}
