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
                let currTab = '';
                for (let i = 0; i < this.rooms.length; i++) {
                    if (this.currentTabIndex === this.rooms[i].index) {
                        currTab = this.rooms[i]._id;
                    }
                }
                const firstRoomId = data.room;
                let tempRooms = this.rooms.map(i => i._id);
                tempRooms = Array.from(new Set([firstRoomId, ...tempRooms]));
                this.rooms = tempRooms.map((item, index) => {
                    return {...this.rooms.find(i => i._id === item), index}
                });
                this.selectedTab = this.rooms.filter(room => room._id === currTab)[0].index;
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

            this.socketService.listen('roomDeleted').subscribe(data => {
                this.rooms = this.rooms.filter(room => room._id !== data.id);
            });

            this.socketService.listen('roomRename').subscribe(data => {
                this.rooms = this.rooms.map(room => {
                    if (room._id === data.id) {
                        console.log('match');
                        room.title = data.title;
                    }
                    return room;
                });
            });

            this.socketService.listen('privacyChanged').subscribe(data => {
                this.rooms = this.rooms.map(room => {
                    if (room._id === data.id) {
                        room.isPublic = data.isPublic;
                    }
                    return room;
                });
            })
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

    public createRoom(): void {
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


