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
    PerfectScrollbarDirective
} from "ngx-perfect-scrollbar";

@Component({
    selector: 'app-room',
    templateUrl: './room.component.html',
    styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, AfterViewInit, DoCheck {
    @Input() currentRoom: Room;
    @ViewChild(PerfectScrollbarComponent, {static: false}) componentRef?: PerfectScrollbarComponent;
    @ViewChild('smileImg', {static: false}) smileImg: ElementRef;
    @ViewChild('inputText', {static: false}) input: ElementRef;

    public messages: Message[] = [];
    public me: string;
    public users: object[] = [];
    public isLoadedTemplate = false;
    public isSmiles = false;
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };

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
        this.chatService.sendSmile.subscribe(smile => {
            if (this.isLoadedTemplate) {
                this.insertSmileIntoInput(smile);
            }
        });
    }

    public ngDoCheck(): void {
        console.log(1);
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

    public openSmiles(): void {
        if(!this.isSmiles) {
            this.smileImg.nativeElement.style.filter = 'invert(100%) drop-shadow(0px 5px 5px black)';
            this.isSmiles = true;
        } else {
            this.smileImg.nativeElement.style.filter = '';
            this.isSmiles = false;
        }
        this.chatService.flipCard.next(true);
    }

    public insertSmileIntoInput(smile: string): void {
        this.input.nativeElement.innerText += smile;
    }
}
