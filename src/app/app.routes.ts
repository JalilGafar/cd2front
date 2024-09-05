import { Routes } from '@angular/router';
import { UsertestComponent } from './usertest/usertest.component';
import { VommentsComponent } from './vomments/vomments.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AboutComponent } from './about/about.component';
import { InfoDiplomeComponent } from './informations/components/info-diplome/info-diplome.component';
import { InfoCapComponent } from './informations/components/info-cap/info-cap.component';
import { InfoBacTechniqueComponent } from './informations/components/info-bac-technique/info-bac-technique.component';
import { InfoCqpComponent } from './informations/components/info-cqp/info-cqp.component';
import { InfoCapaciteComponent } from './informations/components/info-capacite/info-capacite.component';
import { InfoPrepaComponent } from './informations/components/info-prepa/info-prepa.component';
import { InfoBtsComponent } from './informations/components/info-bts/info-bts.component';
import { InfoHndComponent } from './informations/components/info-hnd/info-hnd.component';
import { InfoDutComponent } from './informations/components/info-dut/info-dut.component';
import { InfoLicenceComponent } from './informations/components/info-licence/info-licence.component';
import { InfoBachelorComponent } from './informations/components/info-bachelor/info-bachelor.component';
import { InfoMasterComponent } from './informations/components/info-master/info-master.component';
import { InfoEcoleComponent } from './informations/components/info-ecole/info-ecole.component';
import { InfoMetierComponent } from './informations/components/info-metier/info-metier.component';

export const routes: Routes = [
    {path:'', title: 'Accueil', component: LandingPageComponent},
    {path:'view', title: 'User Set ', component: UsertestComponent},
    {path: 'about', component: AboutComponent},
    {path: 'info/diplome', component: InfoDiplomeComponent},
    {path: 'info/cap', component: InfoCapComponent},
    {path: 'info/bactec', component: InfoBacTechniqueComponent},
    {path: 'info/cqp', component: InfoCqpComponent},
    {path: 'info/capacite', component: InfoCapaciteComponent},
    {path: 'info/prepa', component: InfoPrepaComponent},
    {path: 'info/bts', component: InfoBtsComponent},
    {path: 'info/hnd', component: InfoHndComponent},
    {path: 'info/dut', component: InfoDutComponent},
    {path: 'info/licence', component: InfoLicenceComponent},
    {path: 'info/bachelor', component: InfoBachelorComponent},
    {path: 'info/master', component: InfoMasterComponent},
    {path: 'info/ecole', component: InfoEcoleComponent},
    {path: 'info/metier', component: InfoMetierComponent},
    {path:'comment', title: 'Comment Set', component: VommentsComponent}
];
