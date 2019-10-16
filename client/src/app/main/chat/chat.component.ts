import {Component, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {Message} from "../../shared/models/Message";
import {User} from "../../shared/models/User";
import {log} from "util";
import {MatDialog} from "@angular/material/dialog";
import {DialogOverviewExampleDialogComponent} from "../../dialog-overview-example-dialog/dialog-overview-example-dialog.component";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];
    public newMessage: object = {};
    public newUser: User;

    public name = 'Dialog';
    public animal = 'Me';

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService,
                public dialog: MatDialog
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
            });
        }

    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(DialogOverviewExampleDialogComponent, {
            width: '250px',
            data: {name: this.name, animal: this.animal}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            this.animal = result;
        });
    }
}
