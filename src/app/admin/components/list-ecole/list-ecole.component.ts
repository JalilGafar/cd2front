import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable } from 'rxjs';
import { Ecole } from '../../models/ecole.model';
import { AdminService } from '../../admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-ecole',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule,
  ],
  templateUrl: './list-ecole.component.html',
  styleUrl: './list-ecole.component.scss'
})
export class ListEcoleComponent implements OnInit{

  loading$!: Observable<boolean>;
  ecoles$!: Observable<Ecole[]>;

  constructor(private adminService: AdminService,
              private appRout : Router) { }
              
  ngOnInit(): void {
    this.InitObservable();
    this.adminService.getEcoleFromServer();
  }

  private InitObservable(){
    this.loading$ = this.adminService.loading$;
    this.ecoles$ = this.adminService.ecoles$;
  }

  onRowSelect(event:any){
    this.appRout.navigateByUrl('admin/ecole/'+ event.data.id_ecol.toString());
  }

  onAddEcol(){
    this.appRout.navigateByUrl('admin/new-ecole');
  }

}
