import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModeratorService } from '../../moderator.service';
import { Avis } from '../../../model/avis-model';

@Component({
    selector: 'app-moderation-avis',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './moderation-avis.component.html',
    styleUrl: './moderation-avis.component.scss'
})
export class ModerationAvisComponent implements OnInit {

    avis$!: Observable<Avis[]>;
    loading$!: Observable<boolean>;

    constructor(
        private moderatorService: ModeratorService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.avis$ = this.moderatorService.avis$;
        this.loading$ = this.moderatorService.loading$;
        this.moderatorService.getAvisFromServer();
    }

    onToggleVisibility(avis: Avis): void {
        this.moderatorService.toggleAvisVisibility(avis.id_avis, !avis.visible).subscribe({
            next: () => this.moderatorService.getAvisFromServer()
        });
    }

    onDelete(avis: Avis): void {
        if (confirm(`Supprimer l'avis de "${avis.auteur_avis}" ?`)) {
            this.moderatorService.deleteAvis(avis.id_avis).subscribe({
                next: () => this.moderatorService.getAvisFromServer()
            });
        }
    }
}
