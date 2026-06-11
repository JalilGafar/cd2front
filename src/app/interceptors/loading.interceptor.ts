import { HttpContextToken } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { SpinerService } from '../service/spiner.service';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: SpinerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.context.get(SkipLoading)) {
      return next.handle(req);
    }

    this.loadingService.loadingOn();

    return next.handle(req).pipe(
      finalize(() => this.loadingService.loadingOff())
    );
  }
}
