import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Avis } from '../../../model/avis-model';
import { Observable } from 'rxjs';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-avis',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-avis.component.html',
  styleUrl: './list-avis.component.scss'
})
export class ListAvisComponent implements OnInit {

  avis$!: Observable<Avis[]>;
  loading$!: Observable<boolean>;

  constructor(private adminService: AdminService,
    private appRout : Router) { }
      
  ngOnInit(): void {
  this.InitObservable();
  this.adminService.getAvisFromServer();
  }

  private InitObservable(){
  this.loading$ = this.adminService.loading$;
  this.avis$ = this.adminService.avis$;
  }

  onRowSelect(event:any){
  this.appRout.navigateByUrl('admin/avis/'+ event.data.id_avis.toString());
  }

  onAddAvis(){
    this.appRout.navigateByUrl('admin/new-avis');
  }

}
