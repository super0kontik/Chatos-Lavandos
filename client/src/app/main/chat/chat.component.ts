import {Component, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {Message} from "../../shared/models/Message";
import {User} from "../../shared/models/User";
import {log} from "util";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];
    public newMessage: object = {
        message: '',
        room: '',
    };
    public newUser: User;

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService
                ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.socketService.listen('join').subscribe(data => {
                this.rooms = data.rooms;
            });
            this.socketService.listen('userJoined').subscribe(user => {
                this.newUser = user;
            });
            this.socketService.listen('newMessage').subscribe(data => {
                this.newMessage = data;
                console.log(this.newMessage);
            });
        }

    }
}
