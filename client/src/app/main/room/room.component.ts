import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef, EventEmitter,
    Input,
    OnChanges,
    OnInit, Output,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {Message} from "../../shared/models/Message";
import {
    PerfectScrollbarComponent,
    PerfectScrollbarConfigInterface,
} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {LocalStorageService} from "../../shared/services/local-storage.service";
import {User} from "../../shared/models/User";
import {MatDialog} from "@angular/material/dialog";
import {DialogInvitingRoomComponent} from "../../dialog-inviting-room/dialog-inviting-room.component";
import {EmojifyPipe} from "angular-emojify";
import {DialogRoomSettingsComponent} from "../../dialog-room-settings/dialog-room-settings.component";
import {interval} from "rxjs";
import {log} from "util";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() currentRoom: Room;
    @Input() newMessage: object | boolean;
    @Input() tabIndex: number;
    @Output() leaveFromChat: EventEmitter<any> = new EventEmitter<any>();
    @Output() unreadMessages: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef: PerfectScrollbarComponent;
    @ViewChild('smileImg', {static: false}) smileImg: ElementRef;
    @ViewChild('inputText', {static: false}) input: ElementRef;

    private emoji: EmojifyPipe = new EmojifyPipe();
    private isLoadedTemplate: boolean = false;
    private isBottom: boolean = false;
    private isInit: boolean = false;
    private isSet: boolean = false;
    private currentScrollPosition: number = 0;
    private amountOfUnread: number = 0;
    private isSmiles: boolean = false;
    private loadMessage: Message = {
        room: '',
        creator: {
            _id: '0',
            name: 'me',
            isOnline: true,
            isPremium: true,
            socketId: '1'
        },
        createdAt: new Date(),
        content: 'Load previous messages',
        _id: '0',
        isSystemMessage: true,
        read: true,
    };
    public messages: Message[] = [];
    public creator: User;
    public me: string = '';
    public smile: string = '';
    public users: object[] = [];
    public config: PerfectScrollbarConfigInterface = {scrollingThreshold: 0};
    public theme: string = 'dark';


    constructor(private chatService: ChatService,
                private socketService: SocketService,
                public dialog: MatDialog) {}

    public ngOnInit(): void {
        this.me = LocalStorageService.getUser()['id'];
        this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);

        if (this.currentRoom._id !== 'common') {
            this.currentRoom.users.forEach(user => {
                this.users[user._id] = {
                    name: user.name,
                    online: user.isOnline,
                    premium: user.isPremium,
                    creator: this.currentRoom.creator._id === user._id,
                    userId: user._id
                };
            });
        } else {
            this.currentRoom.users.forEach(user => {
                this.users[user._id] = {
                    name: user.name,
                    online: user.isOnline,
                    premium: user.isPremium,
                    userId: user._id
                };
            });
        }

        this.coincidenceOfTabIndex();

        this.chatService.flipCard.subscribe((flag) => this.isLoadedTemplate && flag ? this.animateSmile() : false);

        if (this.currentRoom._id !== 'common') this.messageRequest();

        this.socketService.listen('userConnected').subscribe(userId => this.changeUserStatusOnline(true, userId));

        this.socketService.listen('userDisconnected').subscribe(userId => this.changeUserStatusOnline(false, userId));

        this.socketService.listen('messageRead').subscribe(messageId => {
            this.messages = this.messages.map(message => {

                if (message.creator._id === this.me && !message.read && message._id === messageId) {
                    console.log(message.read);
                    message.read = true;
                }
                return message;
            });
        });

        this.socketService.listen('userJoined').subscribe(data => {
            if (this.currentRoom._id === data.roomId) {
                if (this.currentRoom._id !== 'common') {
                    this.users[data.user._id] = {
                        name: data.user.name,
                        online: data.user.isOnline,
                        premium: data.user.isPremium,
                        creator: this.currentRoom.creator._id === data.user._id
                    };
                } else {
                    this.users[data.user._id] = {
                        name: data.user.name,
                        online: data.user.isOnline,
                        premium: data.user.isPremium,
                    };
                }
                this.coincidenceOfTabIndex();
            }
        });

        this.socketService.listen('userLeft').subscribe(data => {
            if (this.currentRoom._id === data.roomId) {
                delete this.users[data.userId];
                this.coincidenceOfTabIndex();
            }
        });

        this.isInit = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (!this.isSet) {
            this.currentScrollPosition = +LocalStorageService.getScrollPosition(this.currentRoom._id);
            this.isSet = true;
        }
        if (this.isInit) {
            if (changes['newMessage']) {
                if (this.currentRoom._id === changes['newMessage'].currentValue.room) {
                    this.messages.push(changes['newMessage'].currentValue.message);
                }
            }
        }
        if (changes['tabIndex']) {
            const to = setTimeout(() => {
                this.scrollY(this.currentScrollPosition);
                clearTimeout(to);
            }, 100);
            this.coincidenceOfTabIndex();
        }
    }

    public ngAfterViewInit(): void {
        this.isLoadedTemplate = true;
        const to = setTimeout(() => {
            this.scrollY(this.currentScrollPosition);
            clearTimeout(to);
        }, 200);
    }

    public sendMessage(event: any): void {
        if (this.input.nativeElement.innerText.trim().length > 0) {
            if (event.code === 'Enter') {
                event.preventDefault();
            }
            const transformedMessage = this.emoji.transform(this.input.nativeElement.innerText);
            this.socketService.emit('createMessage', {
                message: transformedMessage.trim(),
                room: this.currentRoom._id,
            });
            this.input.nativeElement.innerText = '';
            const to = setTimeout(() => {
                this.scrollToBottom();
                clearTimeout(to);
            }, 250);
        }
    }

    public isEnd(event: any) {

    }

    public onViewportChange(event: any): void {
        if (this.isLoadedTemplate) {
            console.log(41414141414, event);
            if (this.currentRoom._id !== 'common') {
                if (event.inView) {
                    this.socketService.emit('readMessage', {messageId: event.id});
                }
            }
        }
    }

    public onScroll(event: any): void {
        LocalStorageService.setScrollPosition(this.currentRoom._id, event.target.scrollTop);
        this.currentScrollPosition = event.target.scrollTop;
        this.unreadMessages.emit({
            unread: this.amountOfUnread,
            roomId: this.currentRoom._id
        });
    }

    public messageRequest(scroll?: boolean): void {
        const mesOff = this.messages.length;
        const mesLim = this.messages.length < 50 ? 50 : 20;
        this.chatService.getRoomContent(this.currentRoom._id, mesOff, mesLim).subscribe(messages => {
            this.messages = this.messages.filter(message => message.room !== '');
            this.messages = [...messages, ...this.messages];
            this.messages.unshift(this.loadMessage);
        });
        if (scroll) {
            this.scrollY(1600);
        }
    }

    public openSmiles(): void {
        this.chatService.flipCard.next(true);
    }

    public inviteUsers(): void {
        const dialogRef = this.dialog.open(DialogInvitingRoomComponent, {
            width: '500px',
            height: '550px',
            hasBackdrop: true,
            data: this.currentRoom
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data) {
                this.socketService.emit('inviteUsers', {
                    roomId: data.roomId,
                    participants: data.participants,
                });
            }
        });
    }

    public leaveRoom(): void {
        this.socketService.emit('leaveRoom', {roomId: this.currentRoom._id});
        this.leaveFromChat.emit(this.currentRoom._id);
    }

    public roomSettings(): void {
        const curRoom = Object.assign({}, this.currentRoom);
        const dialogRef = this.dialog.open(DialogRoomSettingsComponent, {
            width: '500px',
            height: '550px',
            hasBackdrop: true,
            data: curRoom
        });

        dialogRef.afterClosed().subscribe(data => {
            if (data && this.currentRoom.index === this.tabIndex) {
                if (data.delete === undefined) {
                    if (data.title !== this.currentRoom.title) {
                        this.socketService.emit('renameRoom', {
                            roomId: data._id,
                            roomTitle: data.title
                        })
                    }
                    if (data.isPublic !== this.currentRoom.isPublic) {
                        this.socketService.emit('privacyChange', {
                            roomId: data._id,
                            roomPublicity: data.isPublic,
                        })
                    }
                    if (data.deletedUsers.length > 0) {
                        data.deletedUsers.forEach(userId => {
                            this.socketService.emit('deleteParticipant', {
                                roomId: data._id,
                                deletedUserId: userId,
                            });
                        });
                    }
                } else {
                    this.socketService.emit('roomDelete', {
                        roomId: data.roomId
                    })
                }
            }
        })
    }

    private animateSmile(): void {
        if (!this.isSmiles) {
            this.smileImg.nativeElement.style.filter = 'invert(100%) drop-shadow(0px 5px 5px black)';
            this.isSmiles = true;
        } else {
            this.smileImg.nativeElement.style.filter = '';
            this.isSmiles = false;
        }
    }

    private coincidenceOfTabIndex(): void {
        if (this.tabIndex === this.currentRoom.index) {
            this.chatService.currentRoomUsers.next(Object.values(this.users));
        }
    }

    private scrollY(scrollTop: number): void {
        if (this.tabIndex === this.currentRoom.index) {
            this.componentRef.directiveRef.scrollToY(scrollTop);
        }
    }

    private scrollToBottom(): void {
        this.componentRef.directiveRef.scrollToBottom(0, 0.3);
    }

    private changeUserStatusOnline(connection: boolean, userId: string): void {
        if (this.users[userId]) this.users[userId]['online'] = connection;
    }
}
