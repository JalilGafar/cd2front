import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  isScrolled = false;
  isCursusOpen = false;

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  toggleCursus(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isCursusOpen = !this.isCursusOpen;
  }

  @HostListener('document:click')
  closeCursus(): void {
    this.isCursusOpen = false;
  }

  closeNavbar(): void {
    const navbar = document.getElementById('navbarSupportedContent');
    if (navbar?.classList.contains('show')) {
      navbar.classList.remove('show');
    }
  }
}
