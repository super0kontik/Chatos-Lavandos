import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Room} from "../../shared/models/Room";
import {PerfectScrollbarConfigInterface} from "ngx-perfect-scrollbar";
import {SocketService} from "../../shared/services/socket.service";
import {ChatService} from "../../shared/services/chat.service";

@Component({
    selector: 'app-room-list',
    templateUrl: './room-list.component.html',
    styleUrls: ['./room-list.component.scss']
})
export class RoomListComponent implements OnInit {
    @Input() rooms: Room[];
    @Output() onSelectedRoom: EventEmitter<any> = new EventEmitter<any>();
    public searchedRooms: Room[];
    public searchText: string = '';
    public isSearchRoomList: boolean = false;
    public config: PerfectScrollbarConfigInterface = {wheelSpeed: 0.2, scrollingThreshold: 0};
    public theme: string = 'dark';

    constructor(private socketService: SocketService,
                private chatService: ChatService) {
    }

    public ngOnInit(): void {
        this.chatService.theme.subscribe(selectedTheme => {
            this.theme = selectedTheme;
        });
        this.socketService.listen('searchRoomsResult').subscribe(rooms => {
            this.searchedRooms = rooms;
        });
    }

    public createRoom(): void {

    }

    public goToRoom(searchedRoom: Room): void {
        if (!this.isSearchRoomList) {
            console.log(searchedRoom)
            this.onSelectedRoom.emit(searchedRoom);
        } else {
            searchedRoom = searchedRoom as Room;
            for (let room of this.rooms) {
                if (room._id === searchedRoom._id) {
                    this.onSelectedRoom.emit(searchedRoom.index);
                    return;
                }
            }
            this.socketService.emit('joinRoom', {roomId: searchedRoom._id});
            this.onSelectedRoom.emit(searchedRoom._id);
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
