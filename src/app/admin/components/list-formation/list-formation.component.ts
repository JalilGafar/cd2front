import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object) { }
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
