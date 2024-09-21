import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-formations',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-formations.component.html',
  styleUrl: './list-formations.component.scss'
})
export class ListFormationsComponent {

}
