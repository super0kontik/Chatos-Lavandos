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

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, DoCheck, OnChanges {
    @Input() currentRoom: Room;
    @Input() newMessage: object | boolean;
    @Input() newUser: object;
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
    @ViewChild('smileImg', {static: false}) smileImg: ElementRef;
    @ViewChild('inputText', {static: false}) input: ElementRef;

    public messages: Message[] = [];
    public me: string = '';
    public users: object[] = [];
    public isLoadedTemplate = false;
    public isSmiles = false;
    public smile: string = '';
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.2,
        scrollingThreshold: 0,
    };

    constructor(private chatService: ChatService,
                private socketService: SocketService
                ) {
    }

    public ngOnInit(): void {

        this.chatService.currentRoomUsers.next(this.currentRoom.users);
        this.me = LocalStorageService.getUser()['id'];

        this.currentRoom.users.forEach(user => {
            this.users[user.id] = {
                name: user.name,
                online: user.isOnline,
                premium: user.isPremium,
            };
        });

        this.chatService.flipCard.subscribe((flag) => {
            if (this.isLoadedTemplate && flag) {
                this.animateSmile();
            }
        });

        this.socketService.listen('userDisconnected').subscribe(userId => {
            if (this.currentRoom._id === 'common') {

                const updatedUsers = {};
                Object.assign(updatedUsers,this.users);
                delete updatedUsers[userId];
                this.chatService.currentRoomUsers.next(Object.values(updatedUsers));
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if(changes['newMessage']) {
            if (this.currentRoom._id === changes['newMessage'].currentValue.room) {
                this.messages.push(changes['newMessage'].currentValue.message);
            }
        }
        if (changes['newUser']) {
            this.users[changes['newUser'].currentValue.id] = {
                name: changes['newUser'].currentValue.name,
                online: changes['newUser'].currentValue.isOnline,
                premium: changes['newUser'].currentValue.isPremium
            };
            this.chatService.currentRoomUsers.next(Object.values(this.users));
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

    public scrollToBottom(): void {
        this.componentRef.directiveRef.scrollToBottom();
    }

    public openSmiles(): void {
        this.chatService.flipCard.next(true);
    }

    public animateSmile(): void {
        if(!this.isSmiles) {
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
