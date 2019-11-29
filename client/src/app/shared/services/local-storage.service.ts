import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    public static setUser(user: string): void {
        localStorage.setItem('user', user);
    }

    public static getUser(): object {
        return JSON.parse(localStorage.getItem('user'));
    }

    public static getToken(): string {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? JSON.parse(localStorage.getItem('user'))['token'] : false;
    }

    public static getBlacklist(): string[] {
        return JSON.parse(localStorage.getItem('user'))['blacklist'];
    }

    public static setBlacklist(blacklistIds: string[]): void {
        localStorage.setItem('blacklist', JSON.stringify(blacklistIds));
    }

    public static logout(): void {
        localStorage.removeItem('user');
    }

    public static setScrollPosition(roomId, scrollPos): void {
        localStorage.setItem(roomId, scrollPos);
    }

    public static getScrollPosition(roomId): string {
        return localStorage.getItem(roomId);
    }

}
