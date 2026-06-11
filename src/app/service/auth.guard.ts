import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { tokenStorageService } from "./token-storage.service";

export const authGuard: CanActivateFn = () => {
    const tokenStorage = inject(tokenStorageService);
    const router = inject(Router);

    if (tokenStorage.getToken()) {
        return true;
    }
    return router.createUrlTree(['/login']);
};