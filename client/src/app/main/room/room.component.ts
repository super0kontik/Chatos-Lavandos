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
export class RoomComponent implements OnInit, AfterViewInit, DoCheck, OnChanges {
    @Input() currentRoom: Room;
    @Input() newMessage: object | boolean;
    @Input() tabIndex: number;
    @Output() leaveFromChat: EventEmitter<any> = new EventEmitter<any>();
    @Output() unreadMessages: EventEmitter<any> = new EventEmitter<any>();
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef: PerfectScrollbarComponent;
    @ViewChild('smileImg', {static: false}) smileImg: ElementRef;
    @ViewChild('inputText', {static: false}) input: ElementRef;

    private emoji: EmojifyPipe = new EmojifyPipe();
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
        isSystemMessage: true
    };
    private isLoadedTemplate: boolean = false;
    private isInit: boolean = false;
    public isSmiles: boolean = false;
    public messages: Message[] = [];
    public creator: User;
    public me: string = '';
    public smile: string = '';
    public users: object[] = [];
    public maxScrollHeight: number = 0;
    public currentScrollPosition: number = 0;
    public amountOfUnread: number = 0;
    public config: PerfectScrollbarConfigInterface = {scrollingThreshold: 0};

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                public dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.me = LocalStorageService.getUser()['id'];

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

        this.chatService.flipCard.subscribe((flag) => {
            if (this.isLoadedTemplate && flag) {
                this.animateSmile();
            }
        });

        if (this.currentRoom._id !== 'common') {
            this.messageRequest();
            const to = setTimeout(() => {
                this.scrollToBottom();
                clearTimeout(to);
            }, 200);
        }

        this.socketService.listen('userConnected').subscribe(userId => {
            this.changeUserStatusOnline(true, userId);
        });

        this.socketService.listen('userDisconnected').subscribe(userId => {
            this.changeUserStatusOnline(false, userId);
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
        if (this.isInit) {
            if (changes['newMessage']) {
                if (this.currentRoom._id === changes['newMessage'].currentValue.room) {
                    const defaultScale = 19;
                    const countOfSymbolsBeforeENDL = 40;
                    if (changes['newMessage'].currentValue.message.isSystemMessage) {
                        this.maxScrollHeight += 52;
                    } else {
                        this.maxScrollHeight += (Math.floor(changes['newMessage'].currentValue.message.content.length / countOfSymbolsBeforeENDL) === 0)
                            ? 112
                            : (112 + Math.floor(changes['newMessage'].currentValue.message.content.length / countOfSymbolsBeforeENDL) * defaultScale);
                    }
                }
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

    public ngDoCheck(): void {
        if (this.isLoadedTemplate) {
            this.coincidenceOfTabIndex();
        }
    }

    public ngAfterViewInit(): void {
        this.isLoadedTemplate = true;
    }

    public setMaxScrollHeight(): void {
        const defaultScale = 19;
        const countOfSymbolsBeforeENDL = 40;
        for (let message of this.messages) {
            if (message.isSystemMessage) {
                this.maxScrollHeight += 52;
            } else {
                this.maxScrollHeight += (Math.floor(message.content.length / countOfSymbolsBeforeENDL) === 0)
                    ? 112
                    : (112 + Math.floor(message.content.length / countOfSymbolsBeforeENDL) * defaultScale);
            }
        }
        this.maxScrollHeight = (this.maxScrollHeight - 622);
    }

    public onScroll(e): void {
        this.currentScrollPosition = e.target.scrollTop;
        this.amountOfUnread = Math.ceil((this.maxScrollHeight - this.currentScrollPosition) / 112);
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
            this.setMaxScrollHeight();
        });
        if (scroll) {
            this.scrollY(1600);
        }
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

    public sendMessage(e): void {
        if (this.input.nativeElement.innerText.trim().length > 0) {
            if (e.code === 'Enter') {
                e.preventDefault();
            }
            const transformedMessage = this.emoji.transform(this.input.nativeElement.innerText);
            this.socketService.emit('createMessage', {
                message: transformedMessage,
                room: this.currentRoom._id,
            });
            this.input.nativeElement.innerText = '';
            const to = setTimeout(() => {
                this.scrollToBottom();
                clearTimeout(to);
            }, 250);
        }
    }

    private coincidenceOfTabIndex(): void {
        if (this.tabIndex === this.currentRoom.index) {
            this.chatService.currentRoomUsers.next(Object.values(this.users));
        }
    }

    private scrollY(scrollTop): void {
        this.componentRef.directiveRef.scrollToY(scrollTop);
    }

    private scrollToBottom(): void {
        this.componentRef.directiveRef.scrollToBottom(0, 0.3);
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

    private changeUserStatusOnline(connection: boolean, userId: string): void {
        if (this.users[userId]) {
            this.users[userId]['online'] = connection;
        }
    }
}
