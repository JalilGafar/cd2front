import { Component, HostListener, OnInit, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgClass, CommonModule } from '@angular/common';
import { tokenStorageService } from '../service/token-storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  isScrolled = false;
  isCursusOpen = false;
  isModerator = false;
  isAdvisor = false;
  username = '';

  get isPrivilegedUser(): boolean {
    return this.isModerator || this.isAdvisor;
  }

  get userRoleLabel(): string {
    if (this.isModerator) return 'Modérateur';
    if (this.isAdvisor)   return 'Conseiller';
    return '';
  }

  get userRoleIcon(): string {
    if (this.isModerator) return 'pi pi-shield';
    if (this.isAdvisor)   return 'pi pi-briefcase';
    return '';
  }

  goToDashboard(): void {
    if (this.isModerator) this.toModerator();
    else if (this.isAdvisor) this.toAdvisor();
  }

  private tokenStorage = inject(tokenStorageService);
  private router = inject(Router);

  ngOnInit(): void {
    const token = this.tokenStorage.getToken();
    if (token) {
      const user = this.tokenStorage.getUser();
      const roles: string[] = user?.roles ?? [];
      this.isModerator = roles.includes('ROLE_MODERATOR');
      this.isAdvisor   = roles.includes('ROLE_ADVISOR');
      this.username = user?.username ?? '';
    }
  }

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

  signOut(): void {
    this.tokenStorage.signOut();
    this.isModerator = false;
    this.isAdvisor   = false;
    this.username = '';
    this.router.navigateByUrl('/login');
  }

  toModerator(): void {
    this.router.navigateByUrl('/moderator');
  }

  toAdvisor(): void {
    this.router.navigateByUrl('/advisor');
  }
}
