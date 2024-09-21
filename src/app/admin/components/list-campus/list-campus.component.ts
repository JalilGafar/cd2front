import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedComponentModule } from '../../../shared/shared.modules';

@Component({
  selector: 'app-list-campus',
  standalone: true,
  imports: [
    CommonModule,
    SharedComponentModule
  ],
  templateUrl: './list-campus.component.html',
  styleUrl: './list-campus.component.scss'
})
export class ListCampusComponent {

}
