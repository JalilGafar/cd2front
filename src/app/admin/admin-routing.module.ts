import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStartComponent } from './components/admin-start/admin-start.component';


const routes: Routes = [
 // { path: '', component: LoginComponent},
  { path: '', component: AdminStartComponent},
 // { path: 'formations', component: FormationListComponent},
  { path: 'adminStart', component: AdminStartComponent},
  { path:'**', redirectTo:'adminStart'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
