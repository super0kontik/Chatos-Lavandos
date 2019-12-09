import {ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogAddingRoomComponent} from "../../dialog-adding-room/dialog-adding-room.component";
import {DialogInvitationComponent} from "../../dialog-invitation/dialog-invitation.component";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {MatBadge} from "@angular/material/badge";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
    @ViewChild('search', {static: false}) search: ElementRef;
    @ViewChild(MatBadge, {static: false}) badge: MatBadge;
    @Output() showParticipants: EventEmitter<any> = new EventEmitter<any>();

    public opened: boolean = false;
    public rooms: Room[];
    public newMessage: object = {};
    public me: string;
    public selectedRoom: Room;
    public unreadInRooms: object = {};
    public theme: string = 'dark';
    public listOfRooms: Room[] = [];
    public overallUnreadMessages: number = 0;

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService,
                public dialog: MatDialog,
                private cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {

            this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
            this.me = LocalStorageService.getUser()['id'];
            this.socketService.listen('join').subscribe(data => {
                this.rooms = data.rooms;
                this.rooms = this.rooms.map((room, index) => {
                    this.unreadInRooms[room._id] = 0;
                    room.lastAction = new Date(room.lastAction);
                    return {...room, index};
                });
                this.listOfRooms = this.rooms;
                this.selectedRoom = this.rooms.find((room) => {
                    if (room._id === LocalStorageService.getlastRoomId()) {
                        return 1;
                    } else {
                        return 0;
                    }
                }) || this.rooms[0];
            });
            this.socketService.listen('newMessage').subscribe(data => {
                this.newMessage = data;
                const tempRoom = this.rooms.find((room) => {
                    if (room._id === data.room) {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                this.rooms = this.rooms.map((room) => {
                    if (room._id === tempRoom._id) {
                        room.lastAction = new Date();
                    }
                    return room;
                });
                if (data.room !== this.selectedRoom._id) {
                    this.unreadInRooms[data.room] += 1;
                    this.recountUnread();
                }
                this.listOfRooms = this.rooms;
            });
            this.socketService.listen('invitation').subscribe(data => this.openInvitation(data));
            this.socketService.listen('newRoom').subscribe(data => {
                data.lastAction = new Date(data.lastAction);
                this.rooms.unshift(data);
                this.unreadInRooms[data._id] = 0;
                this.rooms = this.rooms.map((room, index) => ({...room, index}));
                this.listOfRooms = this.rooms;
            });
            this.socketService.listen('userLeft').subscribe(data => {
                if (data.userId === this.me) this.leaveRoom(data.roomId);
            });
            this.socketService.listen('roomDeleted').subscribe(data => {
                this.rooms = this.rooms.filter(room => room._id !== data.id);
                this.listOfRooms = this.rooms;
                this.selectedRoom = this.rooms[0];
            });
            this.socketService.listen('roomRename').subscribe(data => {
                this.rooms = this.rooms.map(room => {
                    if (room._id === data.id) room.title = data.title;
                    return room;
                });
                this.listOfRooms = this.rooms;
            });
            this.socketService.listen('privacyChanged').subscribe(data => {
                this.rooms = this.rooms.map(room => {
                    if (room._id === data.id) room.isPublic = data.isPublic;
                    return room;
                });
            })
        }
    }

    public recountUnread(): void {
        this.overallUnreadMessages = 0;
        Object.values(this.unreadInRooms).forEach((item) => {
            this.overallUnreadMessages += item;
        });
    }

    public leaveRoom(roomId: string): void {
        this.rooms = this.rooms.filter(room => room._id !== roomId);
        this.rooms = this.rooms.map((room, index) => ({...room, index}));
        this.selectedRoom = this.rooms[0];
    }

    public openSideNav(): void {
        this.opened = !this.opened;
    }

    public createRoom(): void {
        const dialogRef = this.dialog.open(DialogAddingRoomComponent, {
            width: '500px',
            height: '650px',
            hasBackdrop: true
        });
        const aSub = dialogRef.afterClosed().subscribe(result => {
            if (result) this.socketService.emit('createRoom', result);
            aSub.unsubscribe();
        });
    }

    private openInvitation(data: any): void {
        const invitationDialogRef = this.dialog.open(DialogInvitationComponent, {
            width: '450px',
            height: '200px',
            hasBackdrop: true,
            data
        });
        const aSub = invitationDialogRef.afterClosed().subscribe(response => {
            if (response) {
                if (response.isAgree) {
                    this.socketService.emit('acceptInvitation', {
                        roomId: response.roomId
                    });
                } else {
                    this.socketService.emit('leaveRoom', {
                        roomId: response.roomId
                    });
                }
            }
            aSub.unsubscribe();
        });
    }

    public changeUnreadByRoomId(e): void {
        this.unreadInRooms[e.roomId] = e.unread;
        this.recountUnread();
        this.cdr.detectChanges();
    }

    public toggleRoom(id: string): void {
        this.rooms.forEach(room => id === room._id ? this.selectedRoom = room : false);
    }
}


