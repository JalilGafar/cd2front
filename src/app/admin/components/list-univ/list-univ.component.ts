import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { Universite } from '../../models/univ.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-list-univ',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    SharedComponentModule
  ],
  templateUrl: './list-univ.component.html',
  styleUrl: './list-univ.component.scss'
})
export class ListUnivComponent implements OnInit {

  loading$!: Observable<boolean>;
  universites$!: Observable<Universite[]>

  constructor(private adminService: AdminService,
              private appRout : Router) { }
  
  
  ngOnInit(): void {
    this.InitObservable();
    this.adminService.getUniversiteFromServer();
  }

  private InitObservable () {
    this.loading$ = this.adminService.loading$;
    this.universites$ = this.adminService.universite$;
  }

  onRowSelect(event:any){
    this.appRout.navigateByUrl('admin/universite/'+ event.data.id_univ.toString());
  }

  onAddUniv(){
    this.appRout.navigateByUrl('admin/new-universite');
  }

}
