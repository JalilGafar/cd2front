import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { ModeratorService } from '../../moderator.service';
import { Formation } from '../../../admin/models/formation.model';
import { Ecole } from '../../../admin/models/ecole.model';
import { Universite } from '../../../admin/models/univ.model';

@Component({
    selector: 'app-view-data-mod',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './view-data-mod.component.html',
    styleUrl: './view-data-mod.component.scss'
})
export class ViewDataModComponent implements OnInit {

    formations$!: Observable<Formation[]>;
    ecoles$!: Observable<Ecole[]>;
    universites$!: Observable<Universite[]>;
    loading$!: Observable<boolean>;

    formationsView = true;
    ecolesView = false;
    universView = false;

    constructor(
        private moderatorService: ModeratorService,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.formations$ = this.moderatorService.formations$;
        this.ecoles$ = this.moderatorService.ecoles$;
        this.universites$ = this.moderatorService.universites$;
        this.loading$ = this.moderatorService.loading$;
        this.moderatorService.getFormationsFromServer();
    }

    showFormations(): void {
        this.formationsView = true; this.ecolesView = false; this.universView = false;
        this.moderatorService.getFormationsFromServer();
    }

    showEcoles(): void {
        this.formationsView = false; this.ecolesView = true; this.universView = false;
        this.moderatorService.getEcolesFromServer();
    }

    showUniversites(): void {
        this.formationsView = false; this.ecolesView = false; this.universView = true;
        this.moderatorService.getUniversitesFromServer();
    }
}
