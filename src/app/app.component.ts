import { Component, Inject, OnInit, PLATFORM_ID, inject, OnDestroy } from '@angular/core';
import { NavigationStart, Router, RouterLink, RouterOutlet } from '@angular/router';
import { UsertestComponent } from "./usertest/usertest.component";
import { VommentsComponent } from './vomments/vomments.component';
import { DatePipe, NgOptimizedImage, UpperCasePipe, isPlatformBrowser, provideImgixLoader, Location, CommonModule } from '@angular/common';
import { Subscription, fromEvent } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// import { CarService } from './general.service';
import { ReversePipe } from './reverse.pipe';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { environment } from '../environments/environment';
import { SpinerComponent } from './spiner/spiner.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [  RouterOutlet,
                RouterLink,
                FooterComponent,
                SpinerComponent,
                HeaderComponent,
                UsertestComponent, 
                LandingPageComponent,
                NgOptimizedImage,
                ReactiveFormsModule,
                UpperCasePipe,
                DatePipe,
                ReversePipe,
                CommonModule
              ],
    providers: [
     // provideImgixLoader('/assets/'),
    ]
})
export class AppComponent implements OnInit, OnDestroy {
 // carService = inject(CarService);
 // constructor(private petCareService: CarService) {}
  items = new Array();
  display = '';
  date = new Date ;

  private roles!: string[];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username!:string;
  title = 'ecolecamer';
  location!: Location;
  private subs = new Subscription();
  

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });


  constructor(
    // private petCareService: CarService, 
    private router: Router,
    location: Location,
    @Inject(PLATFORM_ID) private platformId: any
    ) {
    // this.display = this.petCareService.getCars();
    this.location = location;

    if (isPlatformBrowser(this.platformId)) {
      // Nettoie les backdrops Bootstrap laissés par le geste "retour" Android
      // sur chaque début de navigation Angular
      this.subs.add(
        this.router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
            this.cleanupBootstrapModals();
          }
        })
      );

      // Filet de sécurité : écoute le popstate natif du navigateur
      // pour les cas où le back gesture Android ne déclenche pas de navigation Angular
      this.subs.add(
        fromEvent(window, 'popstate').subscribe(() => {
          this.cleanupBootstrapModals();
        })
      );
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private cleanupBootstrapModals(): void {
    // Retire tous les backdrops résiduels (l'overlay sombre)
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

    // Remet les modals visibles dans un état caché proprement
    document.querySelectorAll('.modal.show').forEach(el => {
      el.classList.remove('show');
      (el as HTMLElement).style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
      el.removeAttribute('aria-modal');
    });

    // Restaure le body (Bootstrap y ajoute overflow:hidden et padding-right)
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
  }

  addItem(item: string) {
    this.items.push(item);
  }

  handleSubmit() {
    alert(
      this.profileForm.value.name + ' | ' + this.profileForm.value.email
    );
  }

}


// import {Component} from '@angular/core';


// @Component({
//   selector: 'app-user',
//   template: `
//     Username: {{ username }}
//     @if (isLoggedIn) {
//       <p>Welcome back, Friend!</p>
//     }
//   `,
//   standalone: true,
// })
// export class UserComponent {
//   username = 'youngTech';
//   isLoggedIn = true;
// }


// @Component({
//   selector: 'app-root',
//   template: `<app-user/>
//     @if (isServerRunning) {
//       <p>Yes, the server is running {{message}} </p>
//     }
//     @else { <p> No, the server is not running </p> }

//     @for (os of operatingSystems; track os.id) {
//       <ul>
//         <li (mouseover)="onMouseOver()"> {{ os.name }} </li>
//       </ul>
//     }
//     <div [contentEditable]="isEditable"></div>
//     <section (mouseover)="onMouseOver()">
//   `,
//   imports: [UserComponent],
//   styles: `
//     :host {
//     color: #a144eb;
//   }
//   `,
//   standalone: true,
// })
// export class AppComponent {
//   city = 'San Francisco';
//   isServerRunning = true;
//   isEditable = true;
//   message = 'salut !'
//   operatingSystems = [{id: 'win', name: 'Windows'}, {id: 'osx', name: 'MacOS'}, {id: 'linux', name: 'Linux'}];

//   onMouseOver() {
//       this.message = 'Way to go 🚀';
//   }
// }
