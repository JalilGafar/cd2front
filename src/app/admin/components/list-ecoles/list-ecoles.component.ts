import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-ecoles',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-ecoles.component.html',
  styleUrl: './list-ecoles.component.scss'
})
export class ListEcolesComponent {

}
