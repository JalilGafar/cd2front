import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModeratorService } from '../../moderator.service';
import { Article } from '../../../admin/models/article.model';

@Component({
    selector: 'app-list-article-mod',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './list-article-mod.component.html',
    styleUrl: './list-article-mod.component.scss'
})
export class ListArticleModComponent implements OnInit {

    articles$!: Observable<Article[]>;
    loading$!: Observable<boolean>;

    constructor(
        private moderatorService: ModeratorService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.articles$ = this.moderatorService.articles$;
        this.loading$ = this.moderatorService.loading$;
        this.moderatorService.getArticlesFromServer();
    }

    onRowSelect(event: any): void {
        this.router.navigateByUrl('moderator/article/' + event.data.id_actu);
    }

    onNewArticle(): void {
        this.router.navigateByUrl('moderator/new-article');
    }
}
