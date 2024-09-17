import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrientationRoutingModule } from './orientation-routing.module';
 import { NgxMatIntlTelInputComponent } from 'ngx-mat-intl-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrientationRoutingModule,
    NgxIntlTelInputModule
    // NgxMatIntlTelInputComponent,
    // NgxIntlTelInputModule
  ]
})
export class OrientationModule { }
