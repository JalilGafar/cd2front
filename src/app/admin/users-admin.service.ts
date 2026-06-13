import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API } from '../constants/api-endpoints';
import { Moderator } from './models/moderator.model';
import { Advisor } from './models/advisor.model';

@Injectable({ providedIn: 'root' })
export class UsersAdminService {

    constructor(private http: HttpClient) {}

    // ─── Modérateurs ──────────────────────────────────────────────────────────

    private _moderators$ = new BehaviorSubject<Moderator[]>([]);
    get moderators$(): Observable<Moderator[]> {
        return this._moderators$.asObservable();
    }

    private _loadingMod$ = new BehaviorSubject<boolean>(false);
    get loading$(): Observable<boolean> {
        return this._loadingMod$.asObservable();
    }

    getModeratorsFromServer(): void {
        this._loadingMod$.next(true);
        this.http.get<Moderator[]>(API.ADMIN_USERS).pipe(
            tap(moderators => {
                this._moderators$.next(moderators);
                this._loadingMod$.next(false);
            })
        ).subscribe();
    }

    createModerator(form: { username: string; email: string; password: string }): Observable<{ message: string; id: number }> {
        return this.http.post<{ message: string; id: number }>(API.ADMIN_USERS, form);
    }

    deleteModerator(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${API.ADMIN_USERS}/${id}`);
    }

    // ─── Conseillers (Advisors) ───────────────────────────────────────────────

    private _advisors$ = new BehaviorSubject<Advisor[]>([]);
    get advisors$(): Observable<Advisor[]> {
        return this._advisors$.asObservable();
    }

    private _loadingAdv$ = new BehaviorSubject<boolean>(false);
    get loadingAdvisors$(): Observable<boolean> {
        return this._loadingAdv$.asObservable();
    }

    getAdvisorsFromServer(): void {
        this._loadingAdv$.next(true);
        this.http.get<Advisor[]>(API.ADMIN_ADVISORS).pipe(
            tap(advisors => {
                this._advisors$.next(advisors);
                this._loadingAdv$.next(false);
            })
        ).subscribe();
    }

    createAdvisor(form: { username: string; email: string; password: string }): Observable<{ message: string; id: number }> {
        return this.http.post<{ message: string; id: number }>(API.ADMIN_ADVISORS, form);
    }

    deleteAdvisor(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${API.ADMIN_ADVISORS}/${id}`);
    }
}
