import {Component, Input, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {User} from "../../shared/models/User";



@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
    public config: object = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };
    public me: string;

    @Input() currentRoom: Room;

    constructor(private chatService: ChatService) {
        this.me = this.chatService.getUserId();
    }

    ngOnInit() {

    }

    public onChange(event): void {

    }

}
