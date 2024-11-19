import { Component, ContentChild, Input, OnInit, TemplateRef } from '@angular/core';
import { SharedComponentModule } from '../shared/shared.modules';
import { Observable, tap } from 'rxjs';
import { SpinerService } from '../service/spiner.service';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';

@Component({
  selector: 'app-spiner',
  standalone: true,
  imports: [
    SharedComponentModule
  ],
  templateUrl: './spiner.component.html',
  styleUrl: './spiner.component.scss'
})
export class SpinerComponent implements OnInit {

  loading$: Observable<boolean>;

  @Input()
  detectRouteTransitions = false;

  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  constructor(
  private loadingService: SpinerService, 
  private router: Router) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}