import {Injectable} from '@angular/core';
import {User} from "../models/User";
import {me} from "../data";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public currentUser: User;

    constructor() {

    }

    public getUserId(): string {
        return me.userId;
    }

    public getStatus(): boolean {
        return me.isOnline;
    }
}
