import { Routes } from '@angular/router';
import { authGuard } from './service/auth.guard';
import { UsertestComponent } from './usertest/usertest.component';
import { VommentsComponent } from './vomments/vomments.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { EnConstructionComponent } from './en-construction/en-construction.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { PolitiqueComponent } from './politique/politique.component';
import { ConditionComponent } from './condition/condition.component';
import { LegalComponent } from './legal/legal.component';
import { FaqComponent } from './faq/faq.component';
import { OrientationV2Component } from './orientation-v2/orientation-v2.component';

export const routes: Routes = [
    {path:'', component: LandingPageComponent},
    {path:'view', component: UsertestComponent},
    {path: 'about', component: AboutComponent},
    {path: 'register', component: RegisterComponent},
    { path: 'info', loadChildren: () => import('./informations/informations.module').then(m => m.InformationsModule) },
    { path: 'orientation', loadChildren: () => import('./orientation/orientation.module').then(m => m.OrientationModule) },
    { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivate: [authGuard]  },
    { path: 'actualite', loadChildren: () => import('./actualite/actualite.module').then(m => m.ActualiteModule) },
    { path: 'avis', loadChildren: () => import('./student-avis/student-avis.module').then(m => m.StudentAvisModule) },
    { path: 'login', component:LoginComponent},
    { path: 'politique', component:PolitiqueComponent},
    { path: 'condition', component:ConditionComponent},
    { path: 'legal', component:LegalComponent},
    { path: 'faq', component:FaqComponent},
    {path:'comment', title: 'Comment Set', component: VommentsComponent},
    {path:'building', title: 'Page en construction', component: EnConstructionComponent},
    {
        path: 'trouver-ma-formation',
        component: OrientationV2Component,
        title: 'Trouver ma formation | Camerdiplome'
    },
    { path:'**', redirectTo:''}
];
