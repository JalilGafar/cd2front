import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AvisStartComponent } from './components/avis-start/avis-start.component';

const routes: Routes = [
  //  { path: 'blog/:id', component: SingleActuComponent },
    { path: '', component: AvisStartComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AvisRoutingModule { }
