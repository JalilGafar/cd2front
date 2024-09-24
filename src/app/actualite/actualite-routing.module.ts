import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleActuComponent } from './components/single-actu/single-actu.component';

const routes: Routes = [
    { path: 'blog/:id', component: SingleActuComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ActualiteRoutingModule { }
