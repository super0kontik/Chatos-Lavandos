import {Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddingRoomComponent} from "../../dialog-adding-room/dialog-adding-room.component";
import {DialogInvitationComponent} from "../../dialog-invitation/dialog-invitation.component";
import {LocalStorageService} from "../../shared/services/local-storage.service";


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    @ViewChild('search', {static: false}) search: ElementRef;
    public rooms: Room[];
    public newMessage: object = {};
    public userLeft: string;
    public currentTabIndex: number = 0;
    public isRoomList: boolean = false;

    public selectedTab: number;
    public me: string;

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService,
                public dialog: MatDialog
    ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.me = LocalStorageService.getUser()['id'];

            this.socketService.listen('join').subscribe(data => {
                this.rooms = data.rooms;
                this.rooms = this.rooms.map((room, index) => {
                    return {...room, index};
                });
            });

            this.socketService.listen('newMessage').subscribe(data => {
                this.newMessage = data;
            });

            this.socketService.listen('invitation').subscribe(data => {
                this.openInvitation(data);
            });

            this.socketService.listen('newRoom').subscribe(data => {
                this.rooms.unshift(data);
                this.rooms = this.rooms.map((room, index) => {
                    return {...room, index};
                });
            });

            this.socketService.listen('userLeft').subscribe(data => {
                if (data.userId === this.me) {
                    this.leaveRoom(data.roomId);
                    this.selectedTab = this.currentTabIndex = 0;
                }
            });
        }
    }

    public onTabChange(event): void {
        this.currentTabIndex = event;
    }

    public leaveRoom(roomId): void {
        this.rooms = this.rooms.filter(room => room._id !== roomId);
        this.rooms = this.rooms.map((room, index) => {
            return {...room, index};
        });
    }

    public openDialog(): void {
        const dialogRef = this.dialog.open(DialogAddingRoomComponent, {
            width: '500px',
            height: '650px',
            hasBackdrop: true
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.socketService.emit('createRoom', result);
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
                this.socketService.emit('acceptInvitation', {
                    roomId: response.roomId
                });
            } else {
                this.socketService.emit('leaveRoom', {
                    roomId: response.roomId
                })
            }
        });
    }

    public toggleOnList(): void {
        if (!this.isRoomList) {
            this.search.nativeElement.style.filter = 'invert(100%) drop-shadow(0px 3px 10px white)';
        } else {
            this.search.nativeElement.style.filter = '';
        }
        this.isRoomList = !this.isRoomList;
    }

    public toggleRoom(index): void {
        this.toggleOnList();
        this.selectedTab = index;
    }
}


