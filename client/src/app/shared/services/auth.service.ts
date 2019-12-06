import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";
import {User} from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: BehaviorSubject<User> = new BehaviorSubject<User>({
        _id: '0',
        name: 'me',
        isOnline: true,
        isPremium: true,
        socketId: '1',
        avatar: ''
    });

    public isAuthenticated(): boolean {
        const token = LocalStorageService.getToken();
        return token ? !!token : false;
    }
}
