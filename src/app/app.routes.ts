import { Routes } from '@angular/router';
import { UsertestComponent } from './usertest/usertest.component';
import { VommentsComponent } from './vomments/vomments.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { EnConstructionComponent } from './en-construction/en-construction.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [
    {path:'', title: 'Accueil', component: LandingPageComponent},
    {path:'view', title: 'User Set ', component: UsertestComponent},
    {path: 'about', component: AboutComponent},
    { path: 'info', loadChildren: () => import('./informations/informations.module').then(m => m.InformationsModule) },
    { path: 'orientation', loadChildren: () => import('./orientation/orientation.module').then(m => m.OrientationModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
    { path: 'login', component:LoginComponent},
    {path:'comment', title: 'Comment Set', component: VommentsComponent},
    {path:'building', title: 'Page en construction', component: EnConstructionComponent}
];
