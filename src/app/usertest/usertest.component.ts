import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usertest',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usertest.component.html',
  styleUrl: './usertest.component.scss'
})
export class UsertestComponent {
  count = 0;
  favoriteFramework = 'Litle pop'

  @Output() addItem() {}

  @Input() user = '';

  showFramework() {
    alert(this.favoriteFramework);
  }

}
