import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
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
              private appRout : Router,
              @Inject(PLATFORM_ID) private platformId: Object) { }
  
  
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
