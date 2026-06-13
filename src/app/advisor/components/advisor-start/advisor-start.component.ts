import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { tokenStorageService } from '../../../service/token-storage.service';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { AdvisorService } from '../../advisor.service';
import { AdvisorSearchResult } from '../../models/advisor-search-result.model';
import { SchoolPanelComponent } from '../school-panel/school-panel.component';

@Component({
    selector: 'app-advisor-start',
    standalone: true,
    imports: [CommonModule, SharedComponentModule, ReactiveFormsModule, SchoolPanelComponent],
    templateUrl: './advisor-start.component.html',
    styleUrl: './advisor-start.component.scss'
})
export class AdvisorStartComponent implements OnInit {

    username!: string;
    isLoggedIn = false;
    expandedRows: { [key: string]: boolean } = {};

    // Contrôle du panneau latéral (Sprint 2)
    sidebarVisible: boolean = false;
    selectedSchoolId: number | null = null;

    searchForm = new FormGroup({
        diplome: new FormControl<string | null>(null),
        domaine: new FormControl<string | null>(null),
        ville:   new FormControl<string | null>(null),
        budget:  new FormControl<number | null>(null),
    });

    results$    = this.advisorService.results$;
    loading$    = this.advisorService.loading$;
    error$      = this.advisorService.error$;
    hasSearched$ = this.advisorService.hasSearched$;
    categories$ = this.advisorService.categories$;
    domaines$   = this.advisorService.domaines$;
    villes$     = this.advisorService.villes$;

    get isFormEmpty(): boolean {
        const v = this.searchForm.value;
        return !v.diplome && !v.domaine && !v.ville && !v.budget;
    }

    private router = inject(Router);

    constructor(
        private tokenStorageService: tokenStorageService,
        private advisorService: AdvisorService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.isLoggedIn = !!this.tokenStorageService.getToken();
        if (this.isLoggedIn) {
            this.username = this.tokenStorageService.getUser()?.username;
            this.advisorService.loadRefData();
        }
    }

    onSearch(): void {
        if (this.isFormEmpty) return;
        const v = this.searchForm.value;
        this.advisorService.search({
            diplome: v.diplome  ?? undefined,
            domaine: v.domaine  ?? undefined,
            ville:   v.ville    ?? undefined,
            budget:  v.budget   ?? undefined,
        });
    }

    onClear(): void {
        this.searchForm.reset();
        this.advisorService.clearResults();
        this.expandedRows = {};
    }

    getInitials(sigle: string): string {
        return sigle ? sigle.substring(0, 2).toUpperCase() : '??';
    }

    signOut(): void {
        this.tokenStorageService.signOut();
        this.router.navigateByUrl('/login');
    }

    onSchoolSelect(row: AdvisorSearchResult): void {
        this.selectedSchoolId = row.id_ecol;
        this.sidebarVisible = true;
    }

    onSidebarClose(): void {
        this.sidebarVisible = false;
        this.selectedSchoolId = null;
    }
}
