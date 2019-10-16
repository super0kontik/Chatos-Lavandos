import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Room} from "../models/Room";
import {config} from "../config";
import {Message} from "../models/Message";
import {User} from "../models/User";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public flipCard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public currentRoomUsers: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

    constructor(private http: HttpClient) {
    }

    public getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(`${config.API_URL}/mock/rooms`);
    }

    public getRoomContent(id: string): Observable<Message[]> {
        return this.http.get<Message[]>(`${config.API_URL}/mock/roomContent/${id}`);
    }

}
