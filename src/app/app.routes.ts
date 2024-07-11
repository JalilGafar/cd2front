import { Routes } from '@angular/router';
import { UsertestComponent } from './usertest/usertest.component';
import { VommentsComponent } from './vomments/vomments.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { InfoDiplomeComponent } from './informations/components/info-diplome/info-diplome.component';

export const routes: Routes = [
    {path:'', title: 'Accueil', component: LandingPageComponent},
    {path:'view', title: 'User Set ', component: UsertestComponent},
    {path: 'about', component: AboutComponent},
    {path: 'info/diplome', component: InfoDiplomeComponent},
    {path:'comment', title: 'Comment Set', component: VommentsComponent}
];
