import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { UsersAdminService } from '../../users-admin.service';
import { Moderator } from '../../models/moderator.model';

@Component({
    selector: 'app-list-moderators',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './list-moderators.component.html',
    styleUrl: './list-moderators.component.scss'
})
export class ListModeratorsComponent implements OnInit {

    moderators$!: Observable<Moderator[]>;
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
        this.moderators$ = this.usersAdminService.moderators$;
        this.loading$ = this.usersAdminService.loading$;
        this.usersAdminService.getModeratorsFromServer();
    }

    onAddModerator(): void {
        this.router.navigateByUrl('admin/new-moderateur');
    }

    onDelete(moderator: Moderator): void {
        if (confirm(`Supprimer le compte modérateur "${moderator.username}" ?`)) {
            this.usersAdminService.deleteModerator(moderator.id).subscribe({
                next: () => this.usersAdminService.getModeratorsFromServer()
            });
        }
    }
}
