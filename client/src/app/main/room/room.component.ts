import {AfterViewInit, Component, DoCheck, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {ChatService} from "../../shared/services/chat.service";
import {Message} from "../../shared/models/Message";
import {
    PerfectScrollbarComponent,
    PerfectScrollbarConfigInterface,
    PerfectScrollbarDirective
} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() currentRoom: Room;
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
    public messages: Message[] = [];
    public me: string;
    public users: object[] = [];
    public isLoadedTemplate = false;

    constructor(private chatService: ChatService) {
    }

    public ngOnInit(): void {
        this.me = this.chatService.currentUser.id;
        this.currentRoom.users.forEach(user => {
            this.users[user.id] = {
                name: user.name,
                online: user.isOnline,
                premium: user.isPremium,
            };
        });
        this.chatService.getRoomContent(this.currentRoom.id).subscribe(content => {
            this.messages = content;
        });
    }

    public ngDoCheck(): void {
        if (this.isLoadedTemplate) {
            this.scrollToBottom();
        }
    }

    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.scrollToBottom();
        }, 500);
        clearTimeout();
        this.isLoadedTemplate = true;
    }

    public scrollToBottom(): void {
        this.componentRef.directiveRef.scrollToBottom();
    }
}
