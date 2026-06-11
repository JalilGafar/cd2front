import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable, switchMap, tap } from 'rxjs';
import { Universite } from '../../models/univ.model';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-univ',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './single-univ.component.html',
  styleUrl: './single-univ.component.scss'
})
export class SingleUnivComponent implements OnInit {

  loading$!: Observable<boolean>;
  universite$!: Observable<Universite>;
  universite!: Universite;

  constructor(private adminService : AdminService,
              private route: ActivatedRoute,
              private router: Router,
              @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    this.initObservables ()
  }

  initObservables(){
    this.loading$ = this.adminService.loading$;
    this.universite$ = this.route.params.pipe(
      switchMap(params => this.adminService.getUniversiteById(+params['id'])),
      tap(univ=>this.universite =univ)
    );
  }

  onModif(){
    this.router.navigateByUrl('admin/modif-univ/'+ this.universite.id_univ.toString())    
  }

  onDelet(){
    this.adminService.deletUnivById(this.universite.id_univ).subscribe();
    this.router.navigateByUrl('/admin/adminStart')
  }

  onGoBack(){
    this.router.navigateByUrl('/admin/adminStart')
  }

}