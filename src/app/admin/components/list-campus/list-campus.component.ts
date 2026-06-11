import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    private appRout : Router,
    @Inject(PLATFORM_ID) private platformId: Object) { }
      
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
