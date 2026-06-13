import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { tokenStorageService } from './token-storage.service';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => () => {
    const tokenStorage = inject(tokenStorageService);
    const router = inject(Router);

    if (!tokenStorage.getToken()) {
        return router.createUrlTree(['/login']);
    }

    const user = tokenStorage.getUser();
    const userRoles: string[] = user?.roles ?? [];

    if (allowedRoles.some(role => userRoles.includes(role))) {
        return true;
    }

    return router.createUrlTree(['/']);
};
