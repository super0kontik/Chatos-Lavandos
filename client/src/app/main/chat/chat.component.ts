import {Component, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {User} from "../../shared/models/User";

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
                name: 'ЗАЕБАЛИ ВСЯКИЕ ВОЛОДИ',
                users: [
                    {
                        username: 'Toxa',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Tox',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Toy',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                    {
                        username: 'Torelka',
                        isOnline: true,
                        isPremium: false,
                    },
                ]
            },
            {
                name: 'Private',
                users: [{
                    username: 'Debil',
                    isOnline: false,
                    isPremium: false,
                }]
            },
        ];
    }

}
