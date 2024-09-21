import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-diplomes',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-diplomes.component.html',
  styleUrl: './list-diplomes.component.scss'
})
export class ListDiplomesComponent {

}
