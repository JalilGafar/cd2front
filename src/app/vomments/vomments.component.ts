import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@Component({
  selector: 'app-vomments',
  standalone: true,
  imports: [],
  templateUrl: './vomments.component.html',
  styleUrl: './vomments.component.scss'
})
export class VommentsComponent {

}

export const httpInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
