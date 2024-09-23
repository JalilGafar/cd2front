import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';
import { Observable } from 'rxjs';
import { Campus } from '../../models/campus.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-campus',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-campus.component.html',
  styleUrl: './list-campus.component.scss'
})
export class ListCampusComponent implements OnInit{

  loading$!: Observable<boolean>;
  campus$!: Observable<Campus[]>;

  constructor(private adminService: AdminService,
    private appRout : Router) { }
      
  ngOnInit(): void {
  this.InitObservable();
  this.adminService.getCampusFromServer();
  }

  private InitObservable(){
  this.loading$ = this.adminService.loading$;
  this.campus$ = this.adminService.campus$;
  }

  onRowSelect(event:any){
  this.appRout.navigateByUrl('admin/campus/'+ event.data.id_camp.toString());
  }

  onAddCampus(){
    this.appRout.navigateByUrl('admin/new-campus');
  }

}
