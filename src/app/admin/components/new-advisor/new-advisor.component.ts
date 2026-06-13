import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedComponentModule } from '../../../shared/shared.modules';
import { UsersAdminService } from '../../users-admin.service';

@Component({
    selector: 'app-new-advisor',
    standalone: true,
    imports: [CommonModule, SharedComponentModule],
    templateUrl: './new-advisor.component.html',
    styleUrl: './new-advisor.component.scss'
})
export class NewAdvisorComponent implements OnInit {

    newAdvisor!: FormGroup;
    generatedPassword = '';
    passwordCopied = false;
    errorMessage = '';

    private readonly PASSWORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!';

    constructor(
        private formBuilder: FormBuilder,
        private usersAdminService: UsersAdminService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {}

    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        this.newAdvisor = this.formBuilder.group({
            username: [null, [Validators.required, Validators.minLength(3)]],
            email:    [null, [Validators.required, Validators.email]],
            password: [null, Validators.required]
        });
    }

    generatePassword(): void {
        let pwd = '';
        for (let i = 0; i < 12; i++) {
            pwd += this.PASSWORD_CHARS.charAt(Math.floor(Math.random() * this.PASSWORD_CHARS.length));
        }
        this.generatedPassword = pwd;
        this.newAdvisor.patchValue({ password: pwd });
        this.passwordCopied = false;
    }

    copyPassword(): void {
        if (isPlatformBrowser(this.platformId) && this.generatedPassword) {
            navigator.clipboard.writeText(this.generatedPassword);
            this.passwordCopied = true;
        }
    }

    onSubmitForm(): void {
        if (this.newAdvisor.invalid) return;
        this.errorMessage = '';
        this.usersAdminService.createAdvisor(this.newAdvisor.value).subscribe({
            next: () => this.router.navigateByUrl('admin/adminStart'),
            error: (err) => {
                this.errorMessage = err.error?.message || 'Une erreur est survenue.';
            }
        });
    }

    onCancel(): void {
        this.router.navigateByUrl('admin/adminStart');
    }
}
