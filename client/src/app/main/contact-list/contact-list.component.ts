import {Component, Input, OnInit} from '@angular/core';
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {User} from "../../shared/models/User";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";
import {log} from "util";
import {AuthService} from "../../shared/services/auth.service";

@Component({
    selector: 'app-contact-list',
    templateUrl: './contact-list.component.html',
    styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
    @Input() isDisplayed: boolean;

    public list: object[] = [];
    public roomId: string = '';
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };

    constructor(private socketService: SocketService,
                private chatService: ChatService,
                private authService: AuthService
    ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.chatService.currentRoomUsers.subscribe(users => {
                this.list = users;
            });

            this.socketService.listen('userJoined').subscribe(user => {
                this.list.push(user);
            })
        }

    }

}
