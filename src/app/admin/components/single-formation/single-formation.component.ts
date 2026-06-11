import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { Observable, switchMap, tap } from 'rxjs';
import { Formation } from '../../models/formation.model';
import { AdminService } from '../../admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-single-formation',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './single-formation.component.html',
  styleUrl: './single-formation.component.scss'
})
export class SingleFormationComponent implements OnInit{

  loading$!: Observable<boolean>;
  formation$!: Observable<Formation>;
  formation!: Formation;
  universite!: string;
  campus!: string;

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
    this.formation$ = this.route.params.pipe(
      switchMap(params => this.adminService.getFormationById(+params['id'])),
      tap(formation => this.formation = formation)
    );
    console.log(this.formation);
  }

  onModif(){
    this.router.navigateByUrl('admin/modif-formation/'+ this.formation.id_form.toString())    
  }

  onDelet(){
    this.adminService.deletFormationById(this.formation.id_form).subscribe();
    this.router.navigateByUrl('/admin/adminStart')
  }

  onGoBack(){
    this.router.navigateByUrl('/admin/adminStart')
  }

}
