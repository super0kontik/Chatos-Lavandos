import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {Message} from "../../shared/models/Message";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    @Input() currentRoom: Room;

    public config: object = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };
    public messages: Message[] = [];
    public me: string;
    public users: object[] = [];

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.me = this.chatService.currentUser.id;
        this.currentRoom.users.forEach(user => {
            this.users[user.id] = {
                name: user.name,
                online: user.isOnline,
                premium: user.isPremium,
            };
        });
        this.chatService.getRoomContent(this.currentRoom.id).subscribe(content => {
            this.messages = content;
        });
    }

}
