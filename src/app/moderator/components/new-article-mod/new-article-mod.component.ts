import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModeratorService } from '../../moderator.service';

@Component({
    selector: 'app-new-article-mod',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './new-article-mod.component.html',
    styleUrl: './new-article-mod.component.scss'
})
export class NewArticleModComponent implements OnInit {

    newArticle!: FormGroup;
    errorMessage = '';

    constructor(
        private formBuilder: FormBuilder,
        private moderatorService: ModeratorService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.newArticle = this.formBuilder.group({
            title:        [null, Validators.required],
            auteur:       [null, Validators.required],
            visible:      [false],
            summary:      [null],
            illustration: [null],
            sujets:       [null],
            keywords:     [null],
            content:      [null]
        });
    }

    onSubmitForm(): void {
        if (this.newArticle.invalid) return;
        this.moderatorService.addNewArticle(this.newArticle.value).subscribe({
            next: () => this.router.navigateByUrl('moderator/modStart'),
            error: (err) => { this.errorMessage = err.error?.message || 'Erreur lors de la création.'; }
        });
    }

    onCancel(): void {
        this.router.navigateByUrl('moderator/modStart');
    }
}
