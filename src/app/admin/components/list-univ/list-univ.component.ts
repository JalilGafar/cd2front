import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-univ',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-univ.component.html',
  styleUrl: './list-univ.component.scss'
})
export class ListUnivComponent {

}
