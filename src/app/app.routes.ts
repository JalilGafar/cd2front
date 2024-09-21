import { Routes } from '@angular/router';
import { UsertestComponent } from './usertest/usertest.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { EnConstructionComponent } from './en-construction/en-construction.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth.guard';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
    {path:'', title: 'Accueil', component: LandingPageComponent},
    {path:'accueil', title: 'Accueil', component: LandingPageComponent},
    {path:'view', title: 'User Set ', component: UsertestComponent},
    {path: 'about', component: AboutComponent},
    { path: 'info', loadChildren: () => import('./informations/informations.module').then(m => m.InformationsModule) },
    { path: 'orientation', loadChildren: () => import('./orientation/orientation.module').then(m => m.OrientationModule) },
    { path: 'signup', component: SignupComponent},
    { path: 'login', component:LoginComponent},
    { path: 'admin', canActivate: [authGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    {path:'building', title: 'Page en construction', component: EnConstructionComponent},
    { path:'**', redirectTo:''}
];
