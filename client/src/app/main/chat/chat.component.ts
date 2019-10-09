import {Component, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {User} from "../../shared/models/User";
import {fakeAsync} from "@angular/core/testing";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];

    constructor() {
    }

    ngOnInit() {
        this.getRooms();
    }

    public getRooms(): void {
        this.rooms = [
            {
                name: 'Gavno-chat',
                messages: [
                    {
                        createdAt: new Date(),
                        content: 'ffafasfdasfdasfasfas',
                        userId: '124',
                    },
                ],
                users: ['124']
            }
        ];
    }

}
