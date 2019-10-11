import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {
    constructor() {
    }

    public static setUser(user: string): void {
        localStorage.setItem('user', user);
    }

    public static getUser(): object {
        return JSON.parse(localStorage.getItem('user'));
    }

    public static getToken(): string {
        const user = JSON.parse(localStorage.getItem('user'));
        return user ? JSON.parse(localStorage.getItem('user'))['token'] : 'token';
    }

    public static logout(): void {
        localStorage.removeItem('user');
    }

}