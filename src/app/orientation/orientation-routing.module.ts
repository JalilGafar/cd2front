import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DegreeComponent } from "./components/degree/degree.component";
import { CityComponent } from "./components/city/city.component";
import { FieldComponent } from "./components/field/field.component";
import { StatutsComponent } from "./components/statuts/statuts.component";
import { ClasseComponent } from "./components/classe/classe.component";
import { EtudiantComponent } from "./components/etudiant/etudiant.component";
import { DernierdiplomeComponent } from "./components/dernierdiplome/dernierdiplome.component";
import { ContactComponent } from "./components/contact/contact.component";
import { ResultatsComponent } from "./components/resultats/resultats.component";

const routes: Routes = [
    {path: 'degree', component: DegreeComponent },
    {path: 'city', component: CityComponent },
    {path: 'field', component: FieldComponent },
    {path: 'statuts', component: StatutsComponent },
    {path: 'classe', component: ClasseComponent },
    {path: 'etudiant', component: EtudiantComponent },
    {path: 'dernierDiplome', component: DernierdiplomeComponent },
    {path: 'contact', component: ContactComponent },
    {path: 'resultats', component: ResultatsComponent },
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrientationRoutingModule {}