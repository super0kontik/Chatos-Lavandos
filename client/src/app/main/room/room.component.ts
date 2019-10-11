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
import {log} from "util";
import {FormControl} from "@angular/forms";
import {SocketService} from "../../shared/services/socket.service";
import {AuthService} from "../../shared/services/auth.service";

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
    public smile: string = '';
    public access: boolean = false;
    public config: PerfectScrollbarConfigInterface = {
        wheelSpeed: 0.5,
        scrollingThreshold: 0,
    };

    constructor(private chatService: ChatService,
                private socketService: SocketService,
                private authService: AuthService
                ) {
    }

    public ngOnInit(): void {
        if (this.authService.isAuthenticated()) {
            this.access = true;
        }

        this.socketService.listen('newMessage').subscribe(data => {
            console.log(data);
        });
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
        // this.chatService.sendSmile.subscribe(smile => {
        //     if (this.isLoadedTemplate) {
        //         this.smile = smile;
        //
        //         //this.insertSmileIntoInput(smile);
        //     }
        // });
        this.chatService.flipCard.subscribe((flag) => {
            if (this.isLoadedTemplate && flag) {
                this.animateSmile();
            }

        });
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
        this.socketService.emit('createMessage', {message: this.input.nativeElement.innerText});
    }

    // public insertSmileIntoInput(smile: string): void {
    //     this.input.nativeElement.innerText += smile;
    // }
}
