import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminStartComponent } from './components/admin-start/admin-start.component';
import { SingleCampusComponent } from './components/single-campus/single-campus.component';
import { SingleDiplomeComponent } from './components/single-diplome/single-diplome.component';
import { SingleEcoleComponent } from './components/single-ecole/single-ecole.component';
import { SingleUnivComponent } from './components/single-univ/single-univ.component';
import { SingleFormationComponent } from './components/single-formation/single-formation.component';
import { NewCampusComponent } from './components/new-campus/new-campus.component';
import { NewDiplomeComponent } from './components/new-diplome/new-diplome.component';
import { NewEcoleComponent } from './components/new-ecole/new-ecole.component';
import { NewFormationComponent } from './components/new-formation/new-formation.component';
import { NewUnivComponent } from './components/new-univ/new-univ.component';
import { ModifCampusComponent } from './components/modif-campus/modif-campus.component';
import { ModifDiplomeComponent } from './components/modif-diplome/modif-diplome.component';
import { ModifEcoleComponent } from './components/modif-ecole/modif-ecole.component';
import { ModifFormationComponent } from './components/modif-formation/modif-formation.component';
import { ModifUnivComponent } from './components/modif-univ/modif-univ.component';
import { SingleArticleComponent } from './components/single-article/single-article.component';
import { NewArticleComponent } from './components/new-article/new-article.component';

const routes: Routes = [
    { path: '', component: AdminStartComponent},
    { path: 'adminStart', component: AdminStartComponent},
    { path: 'new-campus', component: NewCampusComponent},
    { path: 'new-ecole', component: NewEcoleComponent},
    { path: 'new-diplome', component: NewDiplomeComponent},
    { path: 'new-formation', component: NewFormationComponent},
    { path: 'new-universite', component: NewUnivComponent},
    { path: 'new-article', component: NewArticleComponent},
    { path: 'campus/:id', component: SingleCampusComponent },
    { path: 'diplome/:id', component: SingleDiplomeComponent },
    { path: 'ecole/:id', component: SingleEcoleComponent },
    { path: 'universite/:id', component: SingleUnivComponent },
    { path: 'formation/:id', component: SingleFormationComponent },
    { path: 'article/:id', component: SingleArticleComponent },
    { path: 'modif-univ/:id', component: ModifUnivComponent },
    { path: 'modif-diplome/:id', component: ModifDiplomeComponent },
    { path: 'modif-ecole/:id', component: ModifEcoleComponent },
    { path: 'modif-campus/:id', component: ModifCampusComponent },
    { path: 'modif-formation/:id', component: ModifFormationComponent },
    { path:'**', redirectTo:'adminStart'}
  

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
