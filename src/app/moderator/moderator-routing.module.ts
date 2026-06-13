import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModeratorStartComponent } from './components/moderator-start/moderator-start.component';
import { NewArticleModComponent } from './components/new-article-mod/new-article-mod.component';
import { SingleArticleModComponent } from './components/single-article-mod/single-article-mod.component';
import { ModifArticleModComponent } from './components/modif-article-mod/modif-article-mod.component';

const routes: Routes = [
    { path: '',        component: ModeratorStartComponent },
    { path: 'modStart', component: ModeratorStartComponent },
    { path: 'new-article',       component: NewArticleModComponent },
    { path: 'article/:id',       component: SingleArticleModComponent },
    { path: 'modif-article/:id', component: ModifArticleModComponent },
    { path: '**', redirectTo: 'modStart' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ModeratorRoutingModule {}
