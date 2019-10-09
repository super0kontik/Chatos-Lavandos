import {Injectable} from '@angular/core';
import {User} from "../models/User";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Room} from "../models/Room";
import {config} from "../config";
import {Message} from "../models/Message";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public currentUser: User;

    constructor(private http: HttpClient, private authService: AuthService) {
        this.authService.auth().subscribe(user => {
            this.currentUser = user;
            console.log(this.currentUser);
        });
    }

    public getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(`${config.API_URL}/mock/rooms`);
    }

    public getRoomContent(id: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${config.API_URL}/mock/roomContent/${id}`);
    }

}
