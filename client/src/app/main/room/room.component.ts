import {
    AfterViewInit,
    Component,
    DoCheck,
    ElementRef,
    Input,
    OnChanges,
    OnInit,
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

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, DoCheck, OnChanges {
    @Input() currentRoom: Room;
    @Input() newMessage: object | boolean;
    @Input() tabIndex: number;
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
    @ViewChild('smileImg', {static: false}) smileImg: ElementRef;
    @ViewChild('inputText', {static: false}) input: ElementRef;

    public messages: Message[] = [];
    public me: string = '';
    public users: object[] = [];
    public isLoadedTemplate = false;
    public isSmiles = false;
    public smile: string = '';
    public creator: User;
    public isInit: boolean = false;
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(private chatService: ChatService,
                private socketService: SocketService
    ) {
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
                };
            });
        } else {
            this.currentRoom.users.forEach(user => {
                this.users[user._id] = {
                    name: user.name,
                    online: user.isOnline,
                    premium: user.isPremium,
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
            this.chatService.getRoomContent(this.currentRoom._id).subscribe(messages => {
                this.messages = messages;
            });
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
                    this.messages.push(changes['newMessage'].currentValue.message);
                }
            }
        }

        if (changes['tabIndex']) {
            this.coincidenceOfTabIndex();
        }
    }

    public ngDoCheck(): void {
        if (this.isLoadedTemplate) {
            this.scrollToBottom();
        }
    }

    public ngAfterViewInit(): void {
        this.isLoadedTemplate = true;
    }

    public changeUserStatusOnline(connection: boolean, userId: string): void {
        if (this.users[userId]) {
            this.users[userId]['online'] = connection;
        }
    }


    public coincidenceOfTabIndex(): void {
        if (this.tabIndex === this.currentRoom.index) {
            this.chatService.currentRoomUsers.next(Object.values(this.users));
        }
    }

    public scrollToBottom(): void {
        this.componentRef.directiveRef.scrollToBottom();
    }

    public openSmiles(): void {
        this.chatService.flipCard.next(true);
    }

    public animateSmile(): void {
        if (!this.isSmiles) {
            this.smileImg.nativeElement.style.filter = 'invert(100%) drop-shadow(0px 5px 5px black)';
            this.isSmiles = true;
        } else {
            this.smileImg.nativeElement.style.filter = '';
            this.isSmiles = false;
        }
    }

    public sendMessage(): void {
        this.socketService.emit('createMessage', {
            message: this.input.nativeElement.innerText,
            room: this.currentRoom._id,
        });
        this.input.nativeElement.innerText = '';
    }
}
