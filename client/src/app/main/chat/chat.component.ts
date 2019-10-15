import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];


    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService
                ) {
    }

    public ngOnInit(): void {
        this.chatService.getRooms().subscribe(rooms => {
            this.rooms = rooms;
        });
        if (this.authService.isAuthenticated()) {
            console.log(1);
            this.socketService.listen('join').subscribe(data => {
                console.log(data);
            });
        }
    }
}
