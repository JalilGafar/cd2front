import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../service/loader.service';
import { SpinerService } from '../service/spiner.service';

export const SkipLoading =  new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(
    // private loadingService: LoaderService,
    private loadingService: SpinerService
  ) {}

  // intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  //   //console.log('caught')
  //   this.totalRequests++;
  //   this.loadingService.setLoading(true);
  //   return next.handle(request).pipe(
  //     finalize(() => {
  //       this.totalRequests--;
  //       if (this.totalRequests == 0) {
  //         this.loadingService.setLoading(false);
  //       }
  //     })
  //   )
  // }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check for a custom attribute 
    // to avoid showing loading spinner
    if (req.context.get(SkipLoading)) {
      // Pass the request directly to the next handler
      return next.handle(req);
    }

    // Turn on the loading spinner
    this.loadingService.loadingOn();

    return next.handle(req).pipe(
      finalize(() => {
        // Turn off the loading spinner
        this.loadingService.loadingOff();
      })
    );
  }
}
