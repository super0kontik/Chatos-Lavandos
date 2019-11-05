import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {LocalStorageService} from "./local-storage.service";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    public user: BehaviorSubject<object> = new BehaviorSubject<object>({});

    public isAuthenticated(): boolean {
        const token = LocalStorageService.getToken();
        return token ? !!token : false;
    }
}
