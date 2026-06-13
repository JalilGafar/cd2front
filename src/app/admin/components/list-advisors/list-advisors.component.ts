import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { UsersAdminService } from '../../users-admin.service';
import { Advisor } from '../../models/advisor.model';

@Component({
    selector: 'app-list-advisors',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './list-advisors.component.html',
    styleUrl: './list-advisors.component.scss'
})
export class ListAdvisorsComponent implements OnInit {

    advisors$!: Observable<Advisor[]>;
    loading$!: Observable<boolean>;

    constructor(
        private usersAdminService: UsersAdminService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.advisors$ = this.usersAdminService.advisors$;
        this.loading$  = this.usersAdminService.loadingAdvisors$;
        this.usersAdminService.getAdvisorsFromServer();
    }

    onAddAdvisor(): void {
        this.router.navigateByUrl('admin/new-advisor');
    }

    onDelete(advisor: Advisor): void {
        if (confirm(`Supprimer le compte conseiller "${advisor.username}" ?`)) {
            this.usersAdminService.deleteAdvisor(advisor.id).subscribe({
                next: () => this.usersAdminService.getAdvisorsFromServer()
            });
        }
    }
}
