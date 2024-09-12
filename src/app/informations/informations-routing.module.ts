import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InfoDiplomeComponent } from "./components/info-diplome/info-diplome.component";
import { InfoCapComponent } from "./components/info-cap/info-cap.component";
import { InfoBacTechniqueComponent } from "./components/info-bac-technique/info-bac-technique.component";
import { InfoBachelorComponent } from "./components/info-bachelor/info-bachelor.component";
import { InfoBtsComponent } from "./components/info-bts/info-bts.component";
import { InfoCapaciteComponent } from "./components/info-capacite/info-capacite.component";
import { InfoCqpComponent } from "./components/info-cqp/info-cqp.component";
import { InfoDutComponent } from "./components/info-dut/info-dut.component";
import { InfoEcoleComponent } from "./components/info-ecole/info-ecole.component";
import { InfoHndComponent } from "./components/info-hnd/info-hnd.component";
import { InfoLicenceComponent } from "./components/info-licence/info-licence.component";
import { InfoMasterComponent } from "./components/info-master/info-master.component";
import { InfoMetierComponent } from "./components/info-metier/info-metier.component";
import { InfoPrepaComponent } from "./components/info-prepa/info-prepa.component";

const routes: Routes = [
    {path: 'diplome', component: InfoDiplomeComponent},
    {path: 'cap', component: InfoCapComponent},
    {path: 'bactec', component: InfoBacTechniqueComponent},
    {path: 'cqp', component: InfoCqpComponent},
    {path: 'capacite', component: InfoCapaciteComponent},
    {path: 'prepa', component: InfoPrepaComponent},
    {path: 'bts', component: InfoBtsComponent},
    {path: 'hnd', component: InfoHndComponent},
    {path: 'dut', component: InfoDutComponent},
    {path: 'licence', component: InfoLicenceComponent},
    {path: 'bachelor', component: InfoBachelorComponent},
    {path: 'master', component: InfoMasterComponent},
    {path: 'ecole', component: InfoEcoleComponent},
    {path: 'metier', component: InfoMetierComponent},
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InfoRoutingModule {}