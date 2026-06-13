import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvisorStartComponent } from './components/advisor-start/advisor-start.component';

const routes: Routes = [
    { path: '',           component: AdvisorStartComponent },
    { path: 'advisorStart', component: AdvisorStartComponent },
    { path: '**', redirectTo: 'advisorStart' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdvisorRoutingModule {}
