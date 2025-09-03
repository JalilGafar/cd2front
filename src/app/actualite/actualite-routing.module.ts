import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleActuComponent } from './components/single-actu/single-actu.component';
import { ActuComponent } from './components/actu/actu.component';

const routes: Routes = [
  { path: 'actues', component: ActuComponent },
  { path: 'blog/:subject', component: SingleActuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule { }
