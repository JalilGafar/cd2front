import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModeratorService } from '../../moderator.service';
import { Article } from '../../../admin/models/article.model';

@Component({
    selector: 'app-single-article-mod',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './single-article-mod.component.html',
    styleUrl: './single-article-mod.component.scss'
})
export class SingleArticleModComponent implements OnInit {

    article$!: Observable<Article>;
    article!: Article;

    constructor(
        private moderatorService: ModeratorService,
        private route: ActivatedRoute,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.moderatorService.getArticlesFromServer();
        this.article$ = this.route.params.pipe(
            switchMap(params => this.moderatorService.getArticleById(+params['id'])),
            tap(article => this.article = article)
        );
    }

    onEdit(): void {
        this.router.navigateByUrl('moderator/modif-article/' + this.article.id_actu);
    }

    onDelete(): void {
        if (confirm(`Supprimer l'article "${this.article.title}" ?`)) {
            this.moderatorService.deleteArticle(this.article.id_actu).subscribe({
                next: () => this.router.navigateByUrl('moderator/modStart')
            });
        }
    }

    onBack(): void {
        this.router.navigateByUrl('moderator/modStart');
    }
}
