import { Routes } from '@angular/router';
import { UsertestComponent } from './usertest/usertest.component';
import { VommentsComponent } from './vomments/vomments.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'', title: 'App Home Page', component: HomeComponent},
    {path:'view', title: 'User Set ', component: UsertestComponent},
    {path:'comment', title: 'Comment Set', component: VommentsComponent}
];
