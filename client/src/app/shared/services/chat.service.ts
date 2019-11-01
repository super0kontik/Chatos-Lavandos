import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {config} from "../config";
import {Message} from "../models/Message";

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    public flipCard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public currentRoomUsers: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

    constructor(private http: HttpClient) {
    }

    public getRoomContent(id: string, offset?: number, limit?: number): Observable<Message[]> {
        return this.http.get<Message[]>(`${config.API_URL}/roomContent/${id}?offset=${offset}&limit=${limit}`);
    }

    public addToBlacklist(id: string): Observable<string[]> {
        return this.http.post<string[]>(`${config.API_URL}/blacklist`, {
            blacklistedId: id,
        });
    }

    public deleteFromBlacklist(id: string): Observable<any> {
        return this.http.request('delete', `${config.API_URL}/blacklist`, {
            body: {
                blacklistedId: id,
            }
        });
    }



}
