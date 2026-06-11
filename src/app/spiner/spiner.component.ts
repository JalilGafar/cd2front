import { Component, ContentChild, DestroyRef, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedComponentModule } from '../shared/shared.modules';
import { Observable, tap } from 'rxjs';
import { SpinerService } from '../service/spiner.service';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from '@angular/router';

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

  private loadingService = inject(SpinerService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  loading$: Observable<boolean> = this.loadingService.loading$;

  @Input() detectRouteTransitions = false;

  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof NavigationStart) {
              this.loadingService.loadingOn();
            } else if (
              event instanceof NavigationEnd ||
              event instanceof NavigationCancel ||
              event instanceof NavigationError
            ) {
              this.loadingService.loadingOff();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }
}