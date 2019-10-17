import {Component, Inject, OnInit} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/models/User";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DialogAddingRoomComponent} from "../../dialog-adding-room/dialog-adding-room.component";
import {AddRoomProps} from "../../shared/models/AddRoomProps";
import {DialogInvitationComponent} from "../../dialog-invitation/dialog-invitation.component";



@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    public rooms: Room[];
    public newMessage: object = {};
    public newUser: User;

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
                console.log(data);
                this.newMessage = data;
            });
            this.socketService.listen('invitation').subscribe(data => {
                this.openInvitation(data);
            });
            this.socketService.listen('newRoom').subscribe(data => {
                this.rooms.unshift(data);
            });
        }
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(DialogAddingRoomComponent, {
            width: '500px',
            height: '650px',
            hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            if (result) {
                this.socketService.emit('createRoom', result);
            } else {
                console.log('Not added')
            }
        });
    }

    public openInvitation(data: any): void {
        const invitationDialogRef = this.dialog.open(DialogInvitationComponent, {
            width: '450px',
            height: '200px',
            hasBackdrop: true,
            data
        });
        invitationDialogRef.afterClosed().subscribe(response => {
            if (response.isAgree) {
                this.socketService.emit('joinRoom', {
                    roomId: response.roomId,
                })
            } else {
                console.log(2)
            }
        });
    }
}


