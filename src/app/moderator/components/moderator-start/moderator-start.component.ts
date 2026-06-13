import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { tokenStorageService } from '../../../service/token-storage.service';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModerationAvisComponent } from '../moderation-avis/moderation-avis.component';
import { ListArticleModComponent } from '../list-article-mod/list-article-mod.component';
import { ViewDataModComponent } from '../view-data-mod/view-data-mod.component';

@Component({
    selector: 'app-moderator-start',
    standalone: true,
    imports: [
        CommonModule,
        SharedComponentModule,
        ModerationAvisComponent,
        ListArticleModComponent,
        ViewDataModComponent
    ],
    templateUrl: './moderator-start.component.html',
    styleUrl: './moderator-start.component.scss'
})
export class ModeratorStartComponent implements OnInit {

    username!: string;
    isLoggedIn = false;

    avisView = true;
    articlesView = false;
    donneesView = false;

    constructor(
        private tokenStorageService: tokenStorageService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.isLoggedIn = !!this.tokenStorageService.getToken();
        if (this.isLoggedIn) {
            this.username = this.tokenStorageService.getUser()?.username;
        }
    }

    showAvis(): void {
        this.avisView = true; this.articlesView = false; this.donneesView = false;
    }

    showArticles(): void {
        this.avisView = false; this.articlesView = true; this.donneesView = false;
    }

    showDonnees(): void {
        this.avisView = false; this.articlesView = false; this.donneesView = true;
    }
}
