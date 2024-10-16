import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvisStartComponent } from './components/avis-start/avis-start.component';
import { AvisSchoolComponent } from './components/avis-school/avis-school.component';
import { MonAvisComponent } from './components/mon-avis/mon-avis.component';

const routes: Routes = [
  //  { path: 'blog/:id', component: SingleActuComponent },
    { path: '', component: AvisStartComponent },
    { path: 'avisSchool/:id', component: AvisSchoolComponent },
    { path: 'monAvis/:id', component: MonAvisComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvisRoutingModule { }
