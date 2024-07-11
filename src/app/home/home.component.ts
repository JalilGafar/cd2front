import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  logoUrl = 'https://emsca.com/wp-content/uploads/2023/12/Design-sans-titre-3-1024x768.png';
  logoAlt = 'testeur dimage';

}
