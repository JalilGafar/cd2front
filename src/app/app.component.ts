import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UsertestComponent } from "./usertest/usertest.component";
import { VommentsComponent } from './vomments/vomments.component';
import { DatePipe, NgOptimizedImage, UpperCasePipe, provideImgixLoader } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarService } from './car.service';
import { ReversePipe } from './reverse.pipe';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { InfoDiplomeComponent } from './informations/components/info-diplome/info-diplome.component';
import { HeaderComponent } from './header/header.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [  RouterOutlet,
                RouterLink,
                FooterComponent,
                HeaderComponent,
                UsertestComponent, 
                VommentsComponent,
                LandingPageComponent,
                InfoDiplomeComponent,
                NgOptimizedImage,
                ReactiveFormsModule,
                UpperCasePipe,
                DatePipe,
                ReversePipe
              ],
    providers: [
     // provideImgixLoader('/assets/'),
    ]
})
export class AppComponent {
 // carService = inject(CarService);
 // constructor(private petCareService: CarService) {}
  title = 'La vie est plus belle quand tu te donne à fond';
  items = new Array();
  display = '';
  date = new Date ;
  

  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
  });


  constructor(private petCareService: CarService) {
    this.display = this.petCareService.getCars();
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
