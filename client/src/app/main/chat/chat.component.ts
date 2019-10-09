import {Component, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];

    constructor(private chatService: ChatService) {
    }

    ngOnInit() {
        this.chatService.getRooms().subscribe(rooms => {
            this.rooms = rooms;
        });
    }

}
