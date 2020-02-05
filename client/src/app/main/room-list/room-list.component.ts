import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";

const themes = {0: 'light', 1: 'dark'};

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
    @Input() rooms: Room[];
    @Input() unread: object;
    @Output() onSelectedRoom: EventEmitter<any> = new EventEmitter<any>();
    @Output() onCreateRoom: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeList: EventEmitter<any> = new EventEmitter<any>();
    public searchedRooms: Room[];
    public searchText: string = '';
    public isSearchRoomList: boolean = false;
    public config: PerfectScrollbarConfigInterface = {wheelSpeed: 0.2, scrollingThreshold: 0};
    public theme: string = 'dark';

    constructor(private socketService: SocketService,
                private chatService: ChatService) {
    }

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => this.theme = selectedTheme);
        this.socketService.listen('searchRoomsResult').subscribe(rooms => this.searchedRooms = rooms);
    }

    public createRoom(): void {
        this.onCreateRoom.emit();
    }

    public goToRoom(searchedRoom: Room): void {
        if (!this.isSearchRoomList) {
            this.onSelectedRoom.emit(searchedRoom._id);
            if (this.chatService.device['isMobile']) {
                this.closeList.emit();
            }
        }
        // else {
        //     searchedRoom = searchedRoom as Room;
        //     for (let room of this.rooms) {
        //         if (room._id === searchedRoom._id) {
        //             this.onSelectedRoom.emit(searchedRoom.index);
        //             return;
        //         }
        //     }
        //     this.socketService.emit('joinRoom', {roomId: searchedRoom._id});
        //     this.onSelectedRoom.emit(searchedRoom._id);
        // }
    }

    public toggleTheme(): void {
        if (this.theme === themes[0]) {
            this.socketService.emit('changeColor', {theme: themes[1]});
        } else {
            this.socketService.emit('changeColor', {theme: themes[0]});
        }
    }

    public searchRooms(): void {
        this.socketService.emit('searchRooms', this.searchText);
    }

    public toggleSearch(): void {
        this.isSearchRoomList = !this.isSearchRoomList;
        this.searchRooms();
    }

}
